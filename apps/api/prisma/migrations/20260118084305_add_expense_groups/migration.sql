-- AlterTable
ALTER TABLE "expenses" ADD COLUMN     "expense_group_id" TEXT;

-- CreateTable
CREATE TABLE "expense_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "budget_period_id" TEXT NOT NULL,

    CONSTRAINT "expense_groups_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "expense_groups" ADD CONSTRAINT "expense_groups_budget_period_id_fkey" FOREIGN KEY ("budget_period_id") REFERENCES "budget_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_expense_group_id_fkey" FOREIGN KEY ("expense_group_id") REFERENCES "expense_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
