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
  category: Category;
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
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export interface BudgetSummary {
  income: number;
  totalExpenses: number;
  remaining: number;
  expensesByCategory: Record<string, { total: number; count: number }>;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
