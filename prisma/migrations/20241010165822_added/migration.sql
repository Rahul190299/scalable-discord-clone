/*
  Warnings:

  - Added the required column `isVerified` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Profile` ADD COLUMN `isVerified` BOOLEAN NOT NULL,
    ADD COLUMN `otpExpiresAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
