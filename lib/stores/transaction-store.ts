import { create } from 'zustand';
import {
  TransactionWithCategory,
  TransactionInput,
  TransactionType,
  DailySummary,
  Category,
} from '@/types';
import {
  mockDailySummaries,
  mockExpenseCategories,
  mockIncomeCategories,
} from '@/lib/mock/data';

// ============================================
// Helper Functions
// ============================================
function computeDailySummaries(transactions: TransactionWithCategory[]): DailySummary[] {
  const grouped = transactions.reduce((acc, transaction) => {
    const dateKey = transaction.date.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: transaction.date,
        income: 0,
        expense: 0,
        transactions: [],
      };
    }
    acc[dateKey].transactions.push(transaction);
    if (transaction.type === 'income') {
      acc[dateKey].income += transaction.amount;
    } else if (transaction.type === 'expense') {
      acc[dateKey].expense += transaction.amount;
    }
    return acc;
  }, {} as Record<string, DailySummary>);

  return Object.values(grouped).sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
}

function computeMonthlySummary(
  transactions: TransactionWithCategory[],
  selectedMonth: Date
) {
  const month = selectedMonth.getMonth();
  const year = selectedMonth.getFullYear();

  const monthTransactions = transactions.filter((t) => {
    return t.date.getMonth() === month && t.date.getFullYear() === year;
  });

  const income = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return { income, expense, balance: income - expense };
}

// ============================================
// Store Interface
// ============================================
interface TransactionStore {
  // Data
  transactions: TransactionWithCategory[];
  newTransactionIds: string[];

  // Computed (stored to avoid recalculation)
  dailySummaries: DailySummary[];
  monthlySummary: { income: number; expense: number; balance: number };

  // UI State
  selectedMonth: Date;
  toastVisible: boolean;
  toastType: TransactionType;

  // Actions
  addTransaction: (input: TransactionInput) => void;
  setSelectedMonth: (date: Date) => void;
  hideToast: () => void;
}

// ============================================
// Initial Data
// ============================================
const initialTransactions = mockDailySummaries.flatMap(
  (summary) => summary.transactions
);
const initialMonth = new Date();

// ============================================
// Create Store
// ============================================
export const useTransactionStore = create<TransactionStore>((set, get) => ({
  // Initial State
  transactions: initialTransactions,
  newTransactionIds: [],
  dailySummaries: computeDailySummaries(initialTransactions),
  monthlySummary: computeMonthlySummary(initialTransactions, initialMonth),
  selectedMonth: initialMonth,
  toastVisible: false,
  toastType: 'expense',

  // Actions
  addTransaction: (input) => {
    const allCategories: Category[] = [
      ...mockExpenseCategories,
      ...mockIncomeCategories,
    ];
    const category = allCategories.find((c) => c.id === input.categoryId);
    if (!category) return;

    const now = input.date ?? new Date();
    const newTransaction: TransactionWithCategory = {
      id: `t-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      bookId: 'b1',
      walletId: input.walletId ?? 'w1',
      categoryId: input.categoryId,
      type: input.type,
      amount: input.amount,
      currency: 'THB',
      date: now,
      note: input.note,
      category,
      createdAt: now,
      updatedAt: now,
    };

    const newTransactions = [newTransaction, ...get().transactions];
    const selectedMonth = get().selectedMonth;

    set({
      transactions: newTransactions,
      newTransactionIds: [...get().newTransactionIds, newTransaction.id],
      dailySummaries: computeDailySummaries(newTransactions),
      monthlySummary: computeMonthlySummary(newTransactions, selectedMonth),
      toastVisible: true,
      toastType: input.type,
    });

    // Auto hide toast
    setTimeout(() => {
      set({ toastVisible: false });
    }, 2500);

    // Remove new flag
    setTimeout(() => {
      set((state) => ({
        newTransactionIds: state.newTransactionIds.filter(
          (id) => id !== newTransaction.id
        ),
      }));
    }, 3000);
  },

  setSelectedMonth: (date) => {
    const transactions = get().transactions;
    set({
      selectedMonth: date,
      monthlySummary: computeMonthlySummary(transactions, date),
    });
  },

  hideToast: () => {
    set({ toastVisible: false });
  },
}));
