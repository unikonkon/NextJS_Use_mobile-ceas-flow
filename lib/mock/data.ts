import {
  Wallet,
  TransactionWithCategory,
  DailySummary,
  CategorySummary,
} from '@/types';
import {
  expenseCategories,
  incomeCategories,
} from '@/lib/constants/categories';

// Mock Wallets
export const mockWallets: Wallet[] = [
  {
    id: 'w1',
        name: 'เงินสด',
    type: 'cash',
    icon: '💵',
    color: 'green',
    currency: 'THB',
    initialBalance: 5000,
    currentBalance: 12450,
    isAsset: true,
    createdAt: new Date(),
  },
  {
    id: 'w2',
        name: 'ธ.กสิกรไทย',
    type: 'bank',
    icon: '🏦',
    color: 'green',
    currency: 'THB',
    initialBalance: 50000,
    currentBalance: 145680,
    isAsset: true,
    createdAt: new Date(),
  },
  {
    id: 'w3',
        name: 'PromptPay',
    type: 'e_wallet',
    icon: '📱',
    color: 'blue',
    currency: 'THB',
    initialBalance: 0,
    currentBalance: 3200,
    isAsset: true,
    createdAt: new Date(),
  },
  {
    id: 'w4',
        name: 'บัตรเครดิต KBank',
    type: 'credit_card',
    icon: '💳',
    color: 'purple',
    currency: 'THB',
    initialBalance: 0,
    currentBalance: -15420,
    isAsset: false,
    createdAt: new Date(),
  },
];

// Helper to create dates
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

// Helper to find category by id
const findExpense = (id: string) => expenseCategories.find((c) => c.id === id)!;
const findIncome = (id: string) => incomeCategories.find((c) => c.id === id)!;

// Mock Transactions
export const mockTransactions: TransactionWithCategory[] = [
  // Today
  {
    id: 't1',
        walletId: 'w1',
    categoryId: '1',
    type: 'expense',
    amount: 120,
    currency: 'THB',
    date: today,
    note: 'มื้อเที่ยง',
    category: findExpense('1'), // อาหาร
    wallet: mockWallets[0],
    createdAt: today,
    updatedAt: today,
  },
  {
    id: 't2',
        walletId: 'w2',
    categoryId: '3',
    type: 'expense',
    amount: 45,
    currency: 'THB',
    date: today,
    note: 'BTS',
    category: findExpense('3'), // เดินทาง
    wallet: mockWallets[1],
    createdAt: today,
    updatedAt: today,
  },
  {
    id: 't3',
        walletId: 'w3',
    categoryId: '11',
    type: 'expense',
    amount: 299,
    currency: 'THB',
    date: today,
    note: '7-Eleven',
    category: findExpense('11'), // ของใช้ส่วนตัว
    wallet: mockWallets[2],
    createdAt: today,
    updatedAt: today,
  },
  // Yesterday
  {
    id: 't4',
        walletId: 'w1',
    categoryId: '1',
    type: 'expense',
    amount: 250,
    currency: 'THB',
    date: yesterday,
    note: 'อาหารเย็นกับเพื่อน',
    category: findExpense('1'), // อาหาร
    wallet: mockWallets[0],
    createdAt: yesterday,
    updatedAt: yesterday,
  },
  {
    id: 't5',
        walletId: 'w2',
    categoryId: '101',
    type: 'income',
    amount: 45000,
    currency: 'THB',
    date: yesterday,
    note: 'เงินเดือนเดือน ม.ค.',
    category: findIncome('101'), // เงินเดือน
    wallet: mockWallets[1],
    createdAt: yesterday,
    updatedAt: yesterday,
  },
  {
    id: 't6',
        walletId: 'w4',
    categoryId: '18',
    type: 'expense',
    amount: 590,
    currency: 'THB',
    date: yesterday,
    note: 'Netflix & Spotify',
    category: findExpense('18'), // Subscription
    wallet: mockWallets[3],
    createdAt: yesterday,
    updatedAt: yesterday,
  },
  // Two days ago
  {
    id: 't7',
        walletId: 'w1',
    categoryId: '14',
    type: 'expense',
    amount: 850,
    currency: 'THB',
    date: twoDaysAgo,
    note: 'ค่ายา',
    category: findExpense('14'), // สุขภาพ/ยา
    wallet: mockWallets[0],
    createdAt: twoDaysAgo,
    updatedAt: twoDaysAgo,
  },
  {
    id: 't8',
        walletId: 'w2',
    categoryId: '6',
    type: 'expense',
    amount: 8500,
    currency: 'THB',
    date: twoDaysAgo,
    note: 'ค่าเช่าห้อง',
    category: findExpense('6'), // ค่าเช่า/ผ่อนบ้าน
    wallet: mockWallets[1],
    createdAt: twoDaysAgo,
    updatedAt: twoDaysAgo,
  },
];

// Group transactions by day
export const mockDailySummaries: DailySummary[] = [
  {
    date: today,
    income: 0,
    expense: 464,
    transactions: mockTransactions.filter((t) => t.date.toDateString() === today.toDateString()),
  },
  {
    date: yesterday,
    income: 45000,
    expense: 840,
    transactions: mockTransactions.filter((t) => t.date.toDateString() === yesterday.toDateString()),
  },
  {
    date: twoDaysAgo,
    income: 0,
    expense: 9350,
    transactions: mockTransactions.filter((t) => t.date.toDateString() === twoDaysAgo.toDateString()),
  },
];

// Mock Category Summaries for Analytics
export const mockExpenseSummaries: CategorySummary[] = [
  { category: findExpense('6'), amount: 8500, percentage: 45.2, transactionCount: 1 }, // ค่าเช่า/ผ่อนบ้าน
  { category: findExpense('1'), amount: 370, percentage: 19.7, transactionCount: 2 }, // อาหาร
  { category: findExpense('14'), amount: 850, percentage: 15.3, transactionCount: 1 }, // สุขภาพ/ยา
  { category: findExpense('18'), amount: 590, percentage: 10.6, transactionCount: 1 }, // Subscription
  { category: findExpense('11'), amount: 299, percentage: 5.4, transactionCount: 1 }, // ของใช้ส่วนตัว
  { category: findExpense('3'), amount: 45, percentage: 3.8, transactionCount: 1 }, // เดินทาง
];

export const mockIncomeSummaries: CategorySummary[] = [
  { category: findIncome('101'), amount: 45000, percentage: 100, transactionCount: 1 }, // เงินเดือน
];

// Monthly Summary
export const mockMonthlySummary = {
  income: 45000,
  expense: 10654,
  balance: 34346,
};

// Wallet Summary
export const mockWalletSummary = {
  netWorth: 145910,
  totalAssets: 161330,
  totalLiabilities: 15420,
};
