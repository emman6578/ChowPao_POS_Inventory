/*
  Warnings:

  - You are about to drop the column `isVerified` on the `user` table. All the data in the column will be lost.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `isVerified`,
    ADD COLUMN `role` ENUM('ADMIN', 'DRIVER') NOT NULL DEFAULT 'DRIVER',
    MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `username` VARCHAR(191) NOT NULL;
