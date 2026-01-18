export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  settings: Settings | null;
  categories: Category[];
}

export interface Settings {
  id: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  defaultCategory: DefaultCategory | null;
  createdAt: string;
  updatedAt: string;
}

export type DefaultCategory = 'BILLS' | 'FOOD' | 'TRANSPORT' | 'SAVINGS' | 'ENTERTAINMENT';

export interface BudgetPeriod {
  id: string;
  name: string | null;
  startDate: string;
  endDate: string;
  income: number;
  createdAt: string;
  updatedAt: string;
  expenses: Expense[];
}

export interface Expense {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  categoryId: string;
  budgetPeriodId: string;
  expenseGroupId: string | null;
  category: Category;
  expenseGroup?: ExpenseGroup | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseGroup {
  id: string;
  name: string;
  description: string | null;
  budgetPeriodId: string;
  expenses: Expense[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  name: string;
  username: string;
  password: string;
  settings: {
    currency: string;
  };
}

export interface CreateBudgetPeriodPayload {
  name?: string;
  startDate: string;
  endDate: string;
  income: number;
}

export interface CreateExpensePayload {
  name: string;
  description?: string;
  amount: number;
  categoryId: string;
  budgetPeriodId: string;
  expenseGroupId?: string;
}

export interface UpdateExpensePayload {
  name?: string;
  description?: string;
  amount?: number;
  categoryId?: string;
  expenseGroupId?: string | null;
}

export interface BulkExpenseItem {
  name: string;
  description?: string;
  amount: number;
  categoryId: string;
  expenseGroupId?: string;
}

export interface CreateBulkExpensePayload {
  budgetPeriodId: string;
  expenses: BulkExpenseItem[];
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export interface CreateExpenseGroupPayload {
  name: string;
  description?: string;
  budgetPeriodId: string;
}

export interface UpdateExpenseGroupPayload {
  name?: string;
  description?: string;
}

export interface AddExpensesToGroupPayload {
  expenseIds: string[];
}

export interface MoveExpensesToGroupPayload {
  expenseIds: string[];
  targetGroupId: string | null;
}

export interface UpdateSettingsPayload {
  currency?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  username?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface BudgetSummary {
  income: number;
  totalExpenses: number;
  remaining: number;
  expensesByCategory: Record<string, { total: number; count: number }>;
}

export interface MonthlyBreakdown {
  month: number;
  income: number;
  expenses: number;
}

export interface YearlyMetrics {
  year: number;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  savingsRate: number;
  expensesByCategory: Record<string, { total: number; count: number }>;
  monthlyBreakdown: MonthlyBreakdown[];
  budgetPeriodsCount: number;
}

export interface OverallMetrics {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  savingsRate: number;
  expensesByCategory: Record<string, { total: number; count: number }>;
  budgetPeriodsCount: number;
}

export interface YearlyBreakdownItem {
  year: number;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  monthlyBreakdown: MonthlyBreakdown[];
}

export interface YearRangeMetrics {
  startYear: number;
  endYear: number;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  savingsRate: number;
  expensesByCategory: Record<string, { total: number; count: number }>;
  yearlyBreakdown: YearlyBreakdownItem[];
  budgetPeriodsCount: number;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
