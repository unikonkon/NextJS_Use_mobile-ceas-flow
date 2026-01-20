import { create } from 'zustand';
import type { Category } from '@/types';
import { db, toStoredCategory, fromStoredCategory } from './db';
import {
  mockExpenseCategories,
  mockIncomeCategories,
} from '@/lib/mock/data';

// ============================================
// Store Interface
// ============================================
interface CategoryStore {
  // Data
  expenseCategories: Category[];
  incomeCategories: Category[];
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  loadCategories: () => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  getAllCategories: () => Category[];
}

// ============================================
// Create Store
// ============================================
export const useCategoryStore = create<CategoryStore>((set, get) => ({
  // Initial State
  expenseCategories: [],
  incomeCategories: [],
  isLoading: false,
  isInitialized: false,

  // Actions
  loadCategories: async () => {
    // Prevent multiple loads
    if (get().isLoading || get().isInitialized) return;

    set({ isLoading: true });

    try {
      // Load from IndexedDB
      const storedCategories = await db.categories.toArray();

      if (storedCategories.length === 0) {
        // Seed with mock data on first run
        const allMockCategories = [
          ...mockExpenseCategories,
          ...mockIncomeCategories,
        ];

        // Store to IndexedDB
        await db.categories.bulkPut(
          allMockCategories.map(toStoredCategory)
        );

        set({
          expenseCategories: mockExpenseCategories,
          incomeCategories: mockIncomeCategories,
          isLoading: false,
          isInitialized: true,
        });
      } else {
        // Convert stored categories back to runtime format
        const categories = storedCategories.map(fromStoredCategory);
        const expense = categories.filter((c) => c.type === 'expense');
        const income = categories.filter((c) => c.type === 'income');

        set({
          expenseCategories: expense.sort((a, b) => a.sortOrder - b.sortOrder),
          incomeCategories: income.sort((a, b) => a.sortOrder - b.sortOrder),
          isLoading: false,
          isInitialized: true,
        });
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Fallback to mock data
      set({
        expenseCategories: mockExpenseCategories,
        incomeCategories: mockIncomeCategories,
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  getCategoryById: (id: string) => {
    const { expenseCategories, incomeCategories } = get();
    return (
      expenseCategories.find((c) => c.id === id) ||
      incomeCategories.find((c) => c.id === id)
    );
  },

  getAllCategories: () => {
    const { expenseCategories, incomeCategories } = get();
    return [...expenseCategories, ...incomeCategories];
  },
}));
