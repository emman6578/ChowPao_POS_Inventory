/*
  Warnings:

  - A unique constraint covering the columns `[product_id]` on the table `Product_Info` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Product_Info_product_id_key` ON `Product_Info`(`product_id`);
