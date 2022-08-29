/*
  Warnings:

  - You are about to drop the column `paid` on the `Order` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Created', 'Approved', 'Paid', 'Canceled', 'Failed');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paid",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'Created';
