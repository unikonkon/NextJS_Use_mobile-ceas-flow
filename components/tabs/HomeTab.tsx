'use client';

import { Header, PageContainer } from '@/components/layout';
import { SummaryBar, TransactionList } from '@/components/transactions';
import { MonthPicker } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Calendar, Search, Sparkles } from 'lucide-react';
import { useTransactionStore } from '@/lib/stores';

export function HomeTab() {
  // Select individual values from store (not computed selectors)
  const selectedMonth = useTransactionStore((s) => s.selectedMonth);
  const setSelectedMonth = useTransactionStore((s) => s.setSelectedMonth);
  const newTransactionIds = useTransactionStore((s) => s.newTransactionIds);
  const dailySummaries = useTransactionStore((s) => s.dailySummaries);
  const monthlySummary = useTransactionStore((s) => s.monthlySummary);
  const toastVisible = useTransactionStore((s) => s.toastVisible);
  const toastType = useTransactionStore((s) => s.toastType);

  return (
    <>
      <Header
        showBookSelector
        currentBook="บัญชีส่วนตัว"
        rightAction={
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" className="rounded-full">
              <Search className="size-5" />
            </Button>
            <Button variant="ghost" size="icon-sm" className="rounded-full">
              <Calendar className="size-5" />
            </Button>
          </div>
        }
      />

      <PageContainer className="pt-4">
        {/* Month Picker */}
        <div className="mb-4">
          <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />
        </div>

        {/* Summary */}
        <SummaryBar
          income={monthlySummary.income}
          expense={monthlySummary.expense}
          className="mb-6"
        />

        {/* Transaction List */}
        <TransactionList
          dailySummaries={dailySummaries}
          onTransactionClick={(id) => console.log('Transaction clicked:', id)}
          newTransactionIds={newTransactionIds}
        />
      </PageContainer>

      {/* Success Toast */}
      <div
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out
          ${toastVisible
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          }`}
      >
        <div
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl backdrop-blur-md
            ${toastType === 'income'
              ? 'bg-income/90 text-white'
              : toastType === 'expense'
                ? 'bg-expense/90 text-white'
                : 'bg-transfer/90 text-white'
            }`}
        >
          <Sparkles className="size-5 animate-pulse" />
          <span className="font-medium">
            {toastType === 'income' ? 'เพิ่มรายรับสำเร็จ!' :
             toastType === 'expense' ? 'เพิ่มรายจ่ายสำเร็จ!' :
             'โอนเงินสำเร็จ!'}
          </span>
        </div>
      </div>
    </>
  );
}
