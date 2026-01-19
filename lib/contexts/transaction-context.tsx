'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { TransactionType } from '@/types';

interface TransactionData {
  type: TransactionType;
  amount: number;
  categoryId: string;
  note?: string;
}

interface TransactionContextValue {
  onAddTransaction: ((data: TransactionData) => void) | null;
  setOnAddTransaction: (handler: ((data: TransactionData) => void) | null) => void;
  showSuccessToast: boolean;
  setShowSuccessToast: (show: boolean) => void;
  lastAddedType: TransactionType;
  setLastAddedType: (type: TransactionType) => void;
}

const TransactionContext = createContext<TransactionContextValue | null>(null);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [onAddTransaction, setOnAddTransaction] = useState<((data: TransactionData) => void) | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [lastAddedType, setLastAddedType] = useState<TransactionType>('expense');

  const setHandler = useCallback((handler: ((data: TransactionData) => void) | null) => {
    setOnAddTransaction(() => handler);
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        onAddTransaction,
        setOnAddTransaction: setHandler,
        showSuccessToast,
        setShowSuccessToast,
        lastAddedType,
        setLastAddedType,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactionContext() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionContext must be used within a TransactionProvider');
  }
  return context;
}
