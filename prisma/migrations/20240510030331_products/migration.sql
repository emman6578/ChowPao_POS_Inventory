-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `Category_product_id_fkey`;

-- AlterTable
ALTER TABLE `category` MODIFY `product_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
