/*
  Warnings:

  - You are about to drop the column `medId` on the `Medication` table. All the data in the column will be lost.
  - Added the required column `eVTOL_serialNumber` to the `Medication` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `weight` on the `Medication` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Medication_medId_key";

-- AlterTable
ALTER TABLE "Medication" DROP COLUMN "medId",
ADD COLUMN     "eVTOL_serialNumber" TEXT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "weight",
ADD COLUMN     "weight" INTEGER NOT NULL,
ADD CONSTRAINT "Medication_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_eVTOL_serialNumber_fkey" FOREIGN KEY ("eVTOL_serialNumber") REFERENCES "eVOLTS"("serialNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
