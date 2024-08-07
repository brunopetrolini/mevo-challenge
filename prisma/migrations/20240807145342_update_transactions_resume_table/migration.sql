/*
  Warnings:

  - Changed the type of `total_non_processed` on the `transactions_resume` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "transactions_resume" DROP COLUMN "total_non_processed",
ADD COLUMN     "total_non_processed" INTEGER NOT NULL;
