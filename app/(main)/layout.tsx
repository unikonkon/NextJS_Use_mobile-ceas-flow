'use client';

import { BottomNav } from '@/components/layout';
import { TransactionProvider } from '@/lib/contexts/transaction-context';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TransactionProvider>
      <div className="relative min-h-screen bg-background">
        {children}
        <BottomNav />
      </div>
    </TransactionProvider>
  );
}
