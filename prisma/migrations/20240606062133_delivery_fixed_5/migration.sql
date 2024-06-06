/*
  Warnings:

  - You are about to drop the column `approval` on the `delivery` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `delivery` table. All the data in the column will be lost.
  - You are about to drop the column `delivery_id` on the `deliveryproducts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `deliveryproducts` DROP FOREIGN KEY `DeliveryProducts_delivery_id_fkey`;

-- AlterTable
ALTER TABLE `delivery` DROP COLUMN `approval`,
    DROP COLUMN `status`;

-- AlterTable
ALTER TABLE `deliveryproducts` DROP COLUMN `delivery_id`,
    ADD COLUMN `approval` ENUM('PENDING', 'DISAPPROVED', 'APPROVED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `deliveryId` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('PENDING', 'IN_TRANSIT', 'DELIVERED', 'FAILED') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `DriverProductInventory` (
    `id` VARCHAR(191) NOT NULL,
    `driver_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DriverProductInventoryToProduct` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_DriverProductInventoryToProduct_AB_unique`(`A`, `B`),
    INDEX `_DriverProductInventoryToProduct_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DeliveryProducts` ADD CONSTRAINT `DeliveryProducts_deliveryId_fkey` FOREIGN KEY (`deliveryId`) REFERENCES `Delivery`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DriverProductInventory` ADD CONSTRAINT `DriverProductInventory_driver_id_fkey` FOREIGN KEY (`driver_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DriverProductInventoryToProduct` ADD CONSTRAINT `_DriverProductInventoryToProduct_A_fkey` FOREIGN KEY (`A`) REFERENCES `DriverProductInventory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DriverProductInventoryToProduct` ADD CONSTRAINT `_DriverProductInventoryToProduct_B_fkey` FOREIGN KEY (`B`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
