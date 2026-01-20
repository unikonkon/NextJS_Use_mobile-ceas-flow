import { Category } from '@/types';

export const DEFAULT_EXPENSE_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'อาหาร', type: 'expense' },
  { name: 'ของใช้', type: 'expense' },
  { name: 'การจราจร', type: 'expense' },
  { name: 'เดท', type: 'expense' },
  { name: 'ทางการแพทย์', type: 'expense' },
  { name: 'ครอบครัว', type: 'expense' },
  { name: 'นันทนาการ', type: 'expense' },
  { name: 'ทางสังคม', type: 'expense' },
  { name: 'ที่อยู่อาศัย', type: 'expense' },
  { name: 'สื่อสาร', type: 'expense' },
  { name: 'อื่นๆ', type: 'expense' },
];

export const DEFAULT_INCOME_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'เงินเดือน', type: 'income' },
  { name: 'โบนัส', type: 'income' },
  { name: 'ค่าคอมมิชชั่น', type: 'income' },
  { name: 'ดอกเบี้ย', type: 'income' },
  { name: 'รายได้เสริม', type: 'income' },
];
