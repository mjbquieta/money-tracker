-- AlterEnum
ALTER TYPE "VehicleExpenseType" ADD VALUE 'PARTICIPATION_FEE';

-- AlterTable
ALTER TABLE "vehicle_expenses" ADD COLUMN     "is_full_tank" BOOLEAN;
