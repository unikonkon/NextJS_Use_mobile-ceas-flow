'use client';

import { useState, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  exportToExcel,
  type ExportProgress,
  type ExportData,
} from '@/lib/utils/excel-export';
import {
  importFromExcel,
  type ImportProgress,
  type ImportDependencies,
} from '@/lib/utils/excel-import';
import { useTransactionStore } from '@/lib/stores/transaction-store';
import { useWalletStore } from '@/lib/stores/wallet-store';
import { useCategoryStore } from '@/lib/stores/category-store';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FolderDown,
  Calendar,
  Wallet,
  Tags,
  FileText,
  FileUp,
} from 'lucide-react';

// Progress bar component with animated segments
function ProgressBar({
  progress,
  status,
  colorComplete = 'bg-income',
  colorError = 'bg-expense',
  colorActive = 'bg-primary',
  glowComplete = '--income',
}: {
  progress: number;
  status: string;
  colorComplete?: string;
  colorError?: string;
  colorActive?: string;
  glowComplete?: string;
}) {
  const getBarColor = () => {
    switch (status) {
      case 'complete':
        return colorComplete;
      case 'error':
        return colorError;
      default:
        return colorActive;
    }
  };

  const isActive = status !== 'complete' && status !== 'error' && status !== 'idle';

  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/50">
      {/* Animated background shimmer */}
      {isActive && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, var(--primary) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s ease-in-out infinite',
          }}
        />
      )}
      {/* Progress fill */}
      <div
        className={cn(
          'h-full transition-all duration-500 ease-out',
          getBarColor()
        )}
        style={{
          width: `${progress}%`,
          boxShadow:
            status === 'complete' ? `0 0 12px var(${glowComplete})` : undefined,
        }}
      />
    </div>
  );
}

// Feature item component
function FeatureItem({
  icon,
  label,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/50 text-accent-foreground">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    </div>
  );
}

// Stats preview component
function StatsPreview({
  transactionCount,
  walletCount,
  categoryCount,
}: {
  transactionCount: number;
  walletCount: number;
  categoryCount: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="flex flex-col items-center rounded-xl bg-muted/30 p-3">
        <FileText className="mb-1 size-4 text-primary" />
        <span className="text-lg font-bold tabular-nums text-foreground">
          {transactionCount.toLocaleString()}
        </span>
        <span className="text-[10px] text-muted-foreground">รายการ</span>
      </div>
      <div className="flex flex-col items-center rounded-xl bg-muted/30 p-3">
        <Wallet className="mb-1 size-4 text-income" />
        <span className="text-lg font-bold tabular-nums text-foreground">
          {walletCount}
        </span>
        <span className="text-[10px] text-muted-foreground">กระเป๋า</span>
      </div>
      <div className="flex flex-col items-center rounded-xl bg-muted/30 p-3">
        <Tags className="mb-1 size-4 text-expense" />
        <span className="text-lg font-bold tabular-nums text-foreground">
          {categoryCount}
        </span>
        <span className="text-[10px] text-muted-foreground">หมวดหมู่</span>
      </div>
    </div>
  );
}

// Main component
export function ExportDataCard() {
  const [exportProgress, setExportProgress] = useState<ExportProgress>({
    status: 'idle',
    progress: 0,
    message: '',
  });
  const [importProgress, setImportProgress] = useState<ImportProgress>({
    status: 'idle',
    progress: 0,
    message: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const transactions = useTransactionStore((s) => s.transactions);
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const wallets = useWalletStore((s) => s.wallets);
  const addWallet = useWalletStore((s) => s.addWallet);
  const { expenseCategories, incomeCategories, addCategory, getAllCategories } = useCategoryStore();

  const allCategories = [...expenseCategories, ...incomeCategories];
  const isExporting =
    exportProgress.status !== 'idle' && exportProgress.status !== 'complete' && exportProgress.status !== 'error';
  const isImporting =
    importProgress.status !== 'idle' && importProgress.status !== 'complete' && importProgress.status !== 'error';

  const handleExport = useCallback(async () => {
    if (isExporting) return;

    const data: ExportData = {
      transactions,
      wallets,
      categories: allCategories,
    };

    try {
      await exportToExcel(data, setExportProgress);

      // Reset after success
      setTimeout(() => {
        setExportProgress({ status: 'idle', progress: 0, message: '' });
      }, 3000);
    } catch {
      // Reset after error
      setTimeout(() => {
        setExportProgress({ status: 'idle', progress: 0, message: '' });
      }, 3000);
    }
  }, [isExporting, transactions, wallets, allCategories]);

  const handleImportClick = useCallback(() => {
    if (isImporting) return;
    fileInputRef.current?.click();
  }, [isImporting]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset file input so same file can be selected again
    e.target.value = '';

    const deps: ImportDependencies = {
      existingWallets: useWalletStore.getState().wallets.map((w) => ({ id: w.id, name: w.name })),
      findCategoryByName: (name: string, type: 'income' | 'expense') => {
        const cats = getAllCategories();
        return cats.find((c) => c.name === name && c.type === type);
      },
      addCategory,
      addWallet,
      getWallets: () => useWalletStore.getState().wallets.map((w) => ({ id: w.id, name: w.name })),
      addTransaction,
    };

    try {
      await importFromExcel(file, deps, setImportProgress);

      // Reset after success
      setTimeout(() => {
        setImportProgress({ status: 'idle', progress: 0, message: '' });
      }, 4000);
    } catch {
      // Reset after error
      setTimeout(() => {
        setImportProgress({ status: 'idle', progress: 0, message: '' });
      }, 4000);
    }
  }, [getAllCategories, addCategory, addWallet, addTransaction]);

  const canExport = transactions.length > 0;

  return (
    <Card className="group relative overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-soft">
      {/* Decorative gradient background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          background:
            'radial-gradient(ellipse at top left, oklch(0.65 0.20 145) 0%, transparent 50%), radial-gradient(ellipse at bottom right, oklch(0.55 0.18 260) 0%, transparent 50%)',
        }}
      />

      <CardContent className="relative p-5">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <div className="relative">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-income/20 via-primary/10 to-income/5">
              <FileSpreadsheet className="size-6 text-income" />
            </div>
            {/* Pulse indicator when can export */}
            {canExport && exportProgress.status === 'idle' && importProgress.status === 'idle' && (
              <div className="absolute -right-0.5 -top-0.5 size-3">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-income opacity-75" />
                <span className="relative inline-flex size-3 rounded-full bg-income" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">จัดการข้อมูล Excel</h3>
            <p className="text-xs text-muted-foreground">
              ส่งออกและนำเข้าข้อมูลไฟล์ .xlsx
            </p>
          </div>
        </div>

        {/* Stats Preview */}
        <div className="mb-5">
          <StatsPreview
            transactionCount={transactions.length}
            walletCount={wallets.length}
            categoryCount={allCategories.length}
          />
        </div>

        {/* Features */}
        <div className="mb-5 space-y-3 rounded-xl bg-muted/20 p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            ไฟล์จะประกอบด้วย
          </p>
          <FeatureItem
            icon={<Wallet className="size-4" />}
            label="แยกตามกระเป๋าเงิน"
            description="แต่ละกระเป๋าเงินมีแผ่นงานแยก"
          />
          <FeatureItem
            icon={<Calendar className="size-4" />}
            label="แยกตามเดือน/ปี"
            description="ข้อมูลจัดกลุ่มตามช่วงเวลา"
          />
          <FeatureItem
            icon={<Tags className="size-4" />}
            label="แยกตามหมวดหมู่"
            description="สรุปยอดและรายละเอียดแต่ละหมวด"
          />
        </div>

        {/* Export Progress Section */}
        {exportProgress.status !== 'idle' && (
          <div className="mb-5 animate-slide-up">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {exportProgress.status === 'complete' ? (
                  <CheckCircle2 className="size-4 text-income" />
                ) : exportProgress.status === 'error' ? (
                  <AlertCircle className="size-4 text-expense" />
                ) : (
                  <Loader2 className="size-4 animate-spin text-primary" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    exportProgress.status === 'complete' && 'text-income',
                    exportProgress.status === 'error' && 'text-expense'
                  )}
                >
                  {exportProgress.message}
                </span>
              </div>
              <span className="text-sm font-medium tabular-nums text-muted-foreground">
                {exportProgress.progress}%
              </span>
            </div>
            <ProgressBar
              progress={exportProgress.progress}
              status={exportProgress.status}
            />
          </div>
        )}

        {/* Import Progress Section */}
        {importProgress.status !== 'idle' && (
          <div className="mb-5 animate-slide-up">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {importProgress.status === 'complete' ? (
                  <CheckCircle2 className="size-4 text-income" />
                ) : importProgress.status === 'error' ? (
                  <AlertCircle className="size-4 text-expense" />
                ) : (
                  <Loader2 className="size-4 animate-spin text-primary" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    importProgress.status === 'complete' && 'text-income',
                    importProgress.status === 'error' && 'text-expense'
                  )}
                >
                  {importProgress.message}
                </span>
              </div>
              <span className="text-sm font-medium tabular-nums text-muted-foreground">
                {importProgress.progress}%
              </span>
            </div>
            <ProgressBar
              progress={importProgress.progress}
              status={importProgress.status}
              colorComplete="bg-primary"
              glowComplete="--primary"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={!canExport || isExporting || isImporting}
            className={cn(
              'relative flex-1 overflow-hidden rounded-xl py-3.5 font-medium',
              'transition-all duration-300',
              'disabled:cursor-not-allowed disabled:opacity-50',
              canExport && !isExporting && !isImporting
                ? 'bg-linear-to-r from-income to-primary text-white shadow-lg shadow-income/25 hover:shadow-xl hover:shadow-income/30 active:scale-[0.98]'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {/* Button shimmer effect */}
            {canExport && !isExporting && !isImporting && (
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s ease-in-out infinite',
                }}
              />
            )}

            <span className="relative flex items-center justify-center gap-2">
              {isExporting ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>กำลังส่งออก...</span>
                </>
              ) : exportProgress.status === 'complete' ? (
                <>
                  <CheckCircle2 className="size-5" />
                  <span>สำเร็จ!</span>
                </>
              ) : (
                <>
                  <FolderDown className="size-5" />
                  <span>ส่งออก</span>
                </>
              )}
            </span>
          </button>

          {/* Import Button */}
          <button
            onClick={handleImportClick}
            disabled={isExporting || isImporting}
            className={cn(
              'relative flex-1 overflow-hidden rounded-xl py-3.5 font-medium',
              'transition-all duration-300',
              'disabled:cursor-not-allowed disabled:opacity-50',
              !isExporting && !isImporting
                ? 'bg-linear-to-r from-primary to-[oklch(0.55_0.18_260)] text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {/* Button shimmer effect */}
            {!isExporting && !isImporting && (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s ease-in-out infinite',
                }}
              />
            )}

            <span className="relative flex items-center justify-center gap-2">
              {isImporting ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>กำลังนำเข้า...</span>
                </>
              ) : importProgress.status === 'complete' ? (
                <>
                  <CheckCircle2 className="size-5" />
                  <span>สำเร็จ!</span>
                </>
              ) : (
                <>
                  <FileUp className="size-5" />
                  <span>นำเข้า</span>
                </>
              )}
            </span>
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Helper text */}
        {!canExport && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            ไม่มีข้อมูลรายการให้ส่งออก
          </p>
        )}
      </CardContent>

      {/* Shimmer keyframes */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </Card>
  );
}
