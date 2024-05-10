/*
  Warnings:

  - You are about to drop the column `product_Info_id` on the `category` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `Category_product_Info_id_fkey`;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `product_Info_id`,
    ADD COLUMN `product_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
