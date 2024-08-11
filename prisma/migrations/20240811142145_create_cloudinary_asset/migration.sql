-- CreateEnum
CREATE TYPE "resourceType" AS ENUM ('video', 'image');

-- CreateTable
CREATE TABLE "CloudinaryAsset" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "resourceType" "resourceType" NOT NULL,
    "format" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "bytes" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "duration" DOUBLE PRECISION,
    "frameRate" DOUBLE PRECISION,
    "bitRate" INTEGER,
    "playbackUrl" TEXT,
    "tags" TEXT[],

    CONSTRAINT "CloudinaryAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CloudinaryAsset_assetId_key" ON "CloudinaryAsset"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "CloudinaryAsset_publicId_key" ON "CloudinaryAsset"("publicId");
