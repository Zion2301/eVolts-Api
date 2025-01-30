-- CreateEnum
CREATE TYPE "WEIGHT" AS ENUM ('LIGHTWEIGHT', 'MIDDLEWEIGHT', 'HEAVYWEIGHT', 'CRUISEWEIGHT');

-- CreateEnum
CREATE TYPE "STATE" AS ENUM ('IDLE', 'LOADING', 'LOADED', 'DELIVERING', 'DELIVERED', 'RETURNING');

-- CreateTable
CREATE TABLE "eVOLTS" (
    "serialNumber" TEXT NOT NULL,
    "weightLimit" INTEGER NOT NULL,
    "batteryLevel" INTEGER NOT NULL,
    "weight" "WEIGHT" NOT NULL DEFAULT 'LIGHTWEIGHT',
    "state" "STATE" NOT NULL DEFAULT 'IDLE'
);

-- CreateTable
CREATE TABLE "Medication" (
    "medId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "image" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BatteryLog" (
    "batteryId" SERIAL NOT NULL,
    "eVTOL_serialNumber" TEXT NOT NULL,
    "batteryLevel" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BatteryLog_pkey" PRIMARY KEY ("batteryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "eVOLTS_serialNumber_key" ON "eVOLTS"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Medication_medId_key" ON "Medication"("medId");

-- AddForeignKey
ALTER TABLE "BatteryLog" ADD CONSTRAINT "BatteryLog_eVTOL_serialNumber_fkey" FOREIGN KEY ("eVTOL_serialNumber") REFERENCES "eVOLTS"("serialNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
