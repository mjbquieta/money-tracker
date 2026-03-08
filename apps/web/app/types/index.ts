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
  spendingLimit: number | null;
  isDefault: boolean;
  defaultCategory: DefaultCategory | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategorySpendingStatus {
  categoryId: string;
  categoryName: string;
  spendingLimit: number | null;
  totalSpent: number;
  remaining: number | null;
  percentageUsed: number | null;
  isOverLimit: boolean;
  isApproachingLimit: boolean;
  expenseCount: number;
}

export type DefaultCategory = 'BILLS' | 'FOOD' | 'TRANSPORT' | 'SAVINGS' | 'ENTERTAINMENT';

export interface BudgetPeriod {
  id: string;
  name: string | null;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  expenses: Expense[];
  incomes: Income[];
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
  expenseTags?: ExpenseTag[];
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

export interface Income {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  budgetPeriodId: string;
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

export interface IncomeItem {
  name: string;
  description?: string;
  amount: number;
}

export interface CreateBudgetPeriodPayload {
  name?: string;
  startDate: string;
  endDate: string;
  incomes?: IncomeItem[];
}

export interface CreateIncomePayload {
  name: string;
  description?: string;
  amount: number;
  budgetPeriodId: string;
}

export interface UpdateIncomePayload {
  name?: string;
  description?: string;
  amount?: number;
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
  spendingLimit?: number;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  spendingLimit?: number | null;
}

export interface ExpenseTemplate {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseTemplatePayload {
  name: string;
  description?: string;
  amount: number;
  categoryId: string;
}

export interface UpdateExpenseTemplatePayload {
  name?: string;
  description?: string;
  amount?: number;
  categoryId?: string;
}

export interface CreateExpenseFromTemplatePayload {
  templateId: string;
  budgetPeriodId: string;
  expenseGroupId?: string;
  amount?: number;
  name?: string;
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

export type RecurrenceFrequency = 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'YEARLY';

export interface RecurringExpense {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  frequency: RecurrenceFrequency;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  lastProcessedDate: string | null;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecurringExpensePayload {
  name: string;
  description?: string;
  amount: number;
  categoryId: string;
  frequency: RecurrenceFrequency;
  startDate: string;
  endDate?: string;
}

export interface UpdateRecurringExpensePayload {
  name?: string;
  description?: string;
  amount?: number;
  categoryId?: string;
  frequency?: RecurrenceFrequency;
  startDate?: string;
  endDate?: string | null;
  isActive?: boolean;
}

export interface GenerateRecurringExpensesResult {
  generatedCount: number;
  expenses: Expense[];
}

export interface ExpenseFilters {
  search?: string;
  budgetPeriodId?: string;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  tagIds?: string[];
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface PaginationMeta {
  hasMore: boolean;
  nextCursor?: string | null;
  page?: number;
  pageSize?: number;
  totalCount?: number;
}

export interface ApiResponseMeta {
  timestamp: string;
  pagination?: PaginationMeta;
}

export interface ApiEnvelope<T = unknown> {
  data: T;
  meta: ApiResponseMeta;
}

export interface ApiErrorEnvelope {
  error: ApiError;
  meta: ApiResponseMeta;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

// Personal Budget types
export interface PersonalBudget {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  items: PersonalBudgetItem[];
}

export interface PersonalBudgetItem {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  personalBudgetId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalBudgetItemInput {
  name: string;
  description?: string;
  amount: number;
}

export interface CreatePersonalBudgetPayload {
  name: string;
  description?: string;
  items?: PersonalBudgetItemInput[];
}

export interface UpdatePersonalBudgetPayload {
  name?: string;
  description?: string;
}

export interface CreatePersonalBudgetItemPayload {
  name: string;
  description?: string;
  amount: number;
}

export interface UpdatePersonalBudgetItemPayload {
  name?: string;
  description?: string;
  amount?: number;
}

export interface PersonalBudgetSummary {
  total: number;
  itemCount: number;
}

// Analytics types
export interface DailySpendingData {
  totalExpenses: number;
  totalDays: number;
  dailyAverage: number;
  dailyBreakdown: { date: string; amount: number }[];
}

export interface TopExpenseItem {
  id: string;
  name: string;
  amount: number;
  categoryName: string;
  createdAt: string;
}

export interface CategoryComparisonPeriod {
  budgetPeriodId: string;
  name: string | null;
  startDate: string;
  endDate: string;
  totalExpenses: number;
  totalIncome: number;
  expensesByCategory: Record<string, { total: number; count: number }>;
}

// Session / Auth types
export interface Session {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  lastUsedAt: string | null;
  createdAt: string;
  isCurrent: boolean;
}

export interface TwoFactorSetupResponse {
  secret: string;
  qrCodeDataUrl: string;
  otpAuthUrl: string;
}

export interface TwoFactorVerifyResponse {
  enabled: boolean;
  backupCodes: string[];
}

export interface BackupCodesResponse {
  backupCodes: string[];
}

// Tag types
export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseTag {
  id: string;
  tag: Tag;
}

export interface CreateTagPayload {
  name: string;
  color?: string;
}

export interface UpdateTagPayload {
  name?: string;
  color?: string;
}

// Financial Goal types
export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';

export interface GoalContribution {
  id: string;
  amount: number;
  note: string | null;
  goalId: string;
  createdAt: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  description: string | null;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null;
  status: GoalStatus;
  contributions: GoalContribution[];
  _count: { contributions: number };
  createdAt: string;
  updatedAt: string;
}

export interface GoalsSummary {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  totalTargetAmount: number;
  totalCurrentAmount: number;
  overallProgress: number;
}

export interface CreateFinancialGoalPayload {
  name: string;
  description?: string;
  targetAmount: number;
  targetDate?: string;
}

export interface UpdateFinancialGoalPayload {
  name?: string;
  description?: string;
  targetAmount?: number;
  targetDate?: string;
  status?: GoalStatus;
}

export interface CreateGoalContributionPayload {
  amount: number;
  note?: string;
}

// Debt types
export type DebtType = 'I_OWE' | 'OWED_TO_ME';
export type DebtStatus = 'ACTIVE' | 'SETTLED' | 'CANCELLED';

export interface DebtPayment {
  id: string;
  amount: number;
  note: string | null;
  debtId: string;
  createdAt: string;
}

export interface Debt {
  id: string;
  type: DebtType;
  counterparty: string;
  description: string | null;
  amount: number;
  paidAmount: number;
  dueDate: string | null;
  status: DebtStatus;
  payments: DebtPayment[];
  _count: { payments: number };
  createdAt: string;
  updatedAt: string;
}

export interface DebtSummary {
  totalDebts: number;
  activeDebts: number;
  settledDebts: number;
  totalIOwe: number;
  totalOwedToMe: number;
  iOweCount: number;
  owedToMeCount: number;
}

export interface CreateDebtPayload {
  type: DebtType;
  counterparty: string;
  description?: string;
  amount: number;
  dueDate?: string;
}

export interface UpdateDebtPayload {
  counterparty?: string;
  description?: string;
  amount?: number;
  dueDate?: string;
  status?: DebtStatus;
}

export interface CreateDebtPaymentPayload {
  amount: number;
  note?: string;
}

// Notification types
export type NotificationType =
  | 'BUDGET_LIMIT_EXCEEDED'
  | 'BUDGET_LIMIT_APPROACHING'
  | 'GOAL_MILESTONE'
  | 'GOAL_COMPLETED'
  | 'DEBT_DUE_SOON'
  | 'DEBT_OVERDUE'
  | 'SYSTEM';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data: Record<string, unknown> | null;
  createdAt: string;
}

// Vehicle types
export type VehicleExpenseType =
  | 'FUEL'
  | 'MAINTENANCE'
  | 'INSURANCE'
  | 'PARKING'
  | 'TOLL'
  | 'ACCESSORIES'
  | 'REGISTRATION'
  | 'WASH'
  | 'PARTICIPATION_FEE'
  | 'OTHER';

export interface VehicleExpense {
  id: string;
  type: VehicleExpenseType;
  amount: number;
  description: string | null;
  date: string;
  odometer: number | null;
  fuelLiters: number | null;
  fuelPricePerLiter: number | null;
  isFullTank: boolean | null;
  notes: string | null;
  vehicleId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  name: string;
  make: string | null;
  model: string | null;
  year: number | null;
  licensePlate: string | null;
  notes: string | null;
  expenses: VehicleExpense[];
  _count: { expenses: number };
  createdAt: string;
  updatedAt: string;
}

export interface VehicleSummary {
  totalVehicles: number;
  totalExpenses: number;
  totalSpent: number;
  byType: Record<string, { total: number; count: number }>;
}

export interface VehicleFuelDataPoint {
  date: string;
  liters: number;
  amount: number;
  pricePerLiter: number | null;
  odometer: number | null;
  isFullTank: boolean | null;
}

export interface VehicleMonthlySpending {
  month: string;
  total: number;
  count: number;
}

export interface VehicleFuelStats {
  totalFills: number;
  avgCostPerFill: number;
  totalLiters: number;
  avgPricePerLiter: number;
}

export interface VehicleAnalytics {
  fuelConsumption: VehicleFuelDataPoint[];
  monthlySpending: VehicleMonthlySpending[];
  byType: Record<string, { total: number; count: number }>;
  fuelStats: VehicleFuelStats;
  totalExpenses: number;
}

export interface CreateVehiclePayload {
  name: string;
  make?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
  notes?: string;
}

export interface UpdateVehiclePayload {
  name?: string;
  make?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
  notes?: string;
}

export interface CreateVehicleExpensePayload {
  type: VehicleExpenseType;
  amount: number;
  description?: string;
  date?: string;
  odometer?: number;
  fuelLiters?: number;
  fuelPricePerLiter?: number;
  isFullTank?: boolean;
  notes?: string;
}

export interface UpdateVehicleExpensePayload {
  type?: VehicleExpenseType;
  amount?: number;
  description?: string;
  date?: string;
  odometer?: number;
  fuelLiters?: number;
  fuelPricePerLiter?: number;
  isFullTank?: boolean;
  notes?: string;
}

// Export / Import types
export interface ImportExpenseRecord {
  name: string;
  description?: string;
  amount: number;
  categoryName: string;
}

export interface ImportExpensesPayload {
  budgetPeriodId: string;
  records: ImportExpenseRecord[];
}

export interface ImportResult {
  importedCount: number;
  categoriesCreated: number;
}
