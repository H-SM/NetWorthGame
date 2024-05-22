-- DropForeignKey
ALTER TABLE "UserScores" DROP CONSTRAINT "UserScores_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSettings" DROP CONSTRAINT "UserSettings_userId_fkey";

-- AlterTable
ALTER TABLE "UserScores" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "UserSettings" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("dynamicUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScores" ADD CONSTRAINT "UserScores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("dynamicUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
