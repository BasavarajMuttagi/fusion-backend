/*
  Warnings:

  - Added the required column `displayName` to the `CloudinaryAsset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CloudinaryAsset" ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "starred" BOOLEAN NOT NULL DEFAULT false;
