/*
  Warnings:

  - You are about to drop the column `authorId` on the `Discussion` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Discussion` table. All the data in the column will be lost.
  - You are about to drop the column `forum` on the `Discussion` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Discussion` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Discussion` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Discussion" DROP CONSTRAINT "Discussion_authorId_fkey";

-- AlterTable
ALTER TABLE "Discussion" DROP COLUMN "authorId",
DROP COLUMN "content",
DROP COLUMN "forum",
DROP COLUMN "title",
DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "Snapshot" (
    "discussionId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "until" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR NOT NULL,
    "forum" VARCHAR NOT NULL,
    "authorId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Snapshot_pkey" PRIMARY KEY ("discussionId","time")
);

-- AddForeignKey
ALTER TABLE "Snapshot" ADD CONSTRAINT "Snapshot_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Snapshot" ADD CONSTRAINT "Snapshot_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
