/*
  Warnings:

  - You are about to drop the column `fromUser` on the `SendTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `toUser` on the `SendTransaction` table. All the data in the column will be lost.
  - Added the required column `fromUserId` to the `SendTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toUserId` to the `SendTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SendTransaction" DROP CONSTRAINT "SendTransaction_fromUser_fkey";

-- DropForeignKey
ALTER TABLE "SendTransaction" DROP CONSTRAINT "SendTransaction_toUser_fkey";

-- AlterTable
ALTER TABLE "SendTransaction" DROP COLUMN "fromUser",
DROP COLUMN "toUser",
ADD COLUMN     "fromUserId" INTEGER NOT NULL,
ADD COLUMN     "toUserId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SendTransaction" ADD CONSTRAINT "SendTransaction_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SendTransaction" ADD CONSTRAINT "SendTransaction_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
