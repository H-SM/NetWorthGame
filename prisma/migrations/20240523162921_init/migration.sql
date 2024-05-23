/*
  Warnings:

  - You are about to drop the column `TotalWorth` on the `UserScores` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserScores" DROP COLUMN "TotalWorth",
ADD COLUMN     "totalWorth" DOUBLE PRECISION NOT NULL DEFAULT 0;
