-- CreateEnum
CREATE TYPE "BoatType" AS ENUM ('YACHT', 'PONTOON', 'SPEED_BOAT', 'FISHING_BOAT', 'JET_SKI', 'OTHER');

-- CreateEnum
CREATE TYPE "BoatStatus" AS ENUM ('ACTIVE', 'MAINTENANCE', 'INACTIVE');

-- CreateTable
CREATE TABLE "Boat" (
    "id" TEXT NOT NULL,
    "marinaId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "boatCode" TEXT NOT NULL,
    "description" TEXT,
    "type" "BoatType" NOT NULL,
    "capacity" INTEGER NOT NULL,
    "hourlyRate" DECIMAL(10,2) NOT NULL,
    "status" "BoatStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Boat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Boat_boatCode_key" ON "Boat"("boatCode");

-- CreateIndex
CREATE INDEX "Boat_marinaId_idx" ON "Boat"("marinaId");

-- CreateIndex
CREATE INDEX "Boat_type_idx" ON "Boat"("type");

-- AddForeignKey
ALTER TABLE "Boat" ADD CONSTRAINT "Boat_marinaId_fkey" FOREIGN KEY ("marinaId") REFERENCES "Marina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
