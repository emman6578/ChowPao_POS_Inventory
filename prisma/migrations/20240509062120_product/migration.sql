/*
  Warnings:

  - You are about to drop the column `minimun_stock_level` on the `product` table. All the data in the column will be lost.
  - Added the required column `minimum_stock_level` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `minimun_stock_level`,
    ADD COLUMN `minimum_stock_level` INTEGER NOT NULL;
