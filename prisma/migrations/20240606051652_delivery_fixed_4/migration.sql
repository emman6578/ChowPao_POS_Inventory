-- DropForeignKey
ALTER TABLE `deliveryproducts` DROP FOREIGN KEY `DeliveryProducts_delivery_id_fkey`;

-- AddForeignKey
ALTER TABLE `DeliveryProducts` ADD CONSTRAINT `DeliveryProducts_delivery_id_fkey` FOREIGN KEY (`delivery_id`) REFERENCES `Delivery`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
