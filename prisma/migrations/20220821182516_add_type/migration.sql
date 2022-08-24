-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('Burger', 'Drink');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "type" "ProductType" NOT NULL DEFAULT 'Burger';
