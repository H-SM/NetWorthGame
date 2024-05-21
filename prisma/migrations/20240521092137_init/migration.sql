/*
  Warnings:

  - You are about to drop the column `darkMode` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `languagePreference` on the `UserSettings` table. All the data in the column will be lost.
  - Added the required column `username` to the `UserSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "darkMode",
DROP COLUMN "languagePreference",
ADD COLUMN     "theme" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "username" TEXT NOT NULL;
