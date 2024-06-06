/*
  Warnings:

  - Added the required column `quantity` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Delivery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `delivery` ADD COLUMN `quantity` INTEGER NOT NULL,
    ADD COLUMN `total` DOUBLE NOT NULL;
