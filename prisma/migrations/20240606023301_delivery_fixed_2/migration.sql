/*
  Warnings:

  - You are about to drop the column `quantity` on the `delivery` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `delivery` table. All the data in the column will be lost.
  - You are about to drop the `_deliverytoproduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_deliverytoproduct` DROP FOREIGN KEY `_DeliveryToProduct_A_fkey`;

-- DropForeignKey
ALTER TABLE `_deliverytoproduct` DROP FOREIGN KEY `_DeliveryToProduct_B_fkey`;

-- AlterTable
ALTER TABLE `delivery` DROP COLUMN `quantity`,
    DROP COLUMN `total`;

-- DropTable
DROP TABLE `_deliverytoproduct`;

-- CreateTable
CREATE TABLE `DeliveryProducts` (
    `id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `total` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `delivery_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DeliveryProductsToProduct` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_DeliveryProductsToProduct_AB_unique`(`A`, `B`),
    INDEX `_DeliveryProductsToProduct_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DeliveryProducts` ADD CONSTRAINT `DeliveryProducts_delivery_id_fkey` FOREIGN KEY (`delivery_id`) REFERENCES `Delivery`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DeliveryProductsToProduct` ADD CONSTRAINT `_DeliveryProductsToProduct_A_fkey` FOREIGN KEY (`A`) REFERENCES `DeliveryProducts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DeliveryProductsToProduct` ADD CONSTRAINT `_DeliveryProductsToProduct_B_fkey` FOREIGN KEY (`B`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
