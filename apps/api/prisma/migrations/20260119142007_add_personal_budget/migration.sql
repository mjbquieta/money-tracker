-- CreateTable
CREATE TABLE "personal_budgets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "personal_budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_budget_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "personal_budget_id" TEXT NOT NULL,

    CONSTRAINT "personal_budget_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "personal_budgets" ADD CONSTRAINT "personal_budgets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_budget_items" ADD CONSTRAINT "personal_budget_items_personal_budget_id_fkey" FOREIGN KEY ("personal_budget_id") REFERENCES "personal_budgets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
