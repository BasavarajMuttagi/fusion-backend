/*
  Warnings:

  - Added the required column `userId` to the `CloudinaryAsset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CloudinaryAsset" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CloudinaryAsset" ADD CONSTRAINT "CloudinaryAsset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
