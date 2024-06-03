/*
  Warnings:

  - Added the required column `value` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "wallet" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
