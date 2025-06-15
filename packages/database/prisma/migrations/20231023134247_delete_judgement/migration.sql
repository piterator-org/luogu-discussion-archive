/*
  Warnings:

  - You are about to drop the `Judgement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Judgement" DROP CONSTRAINT "Judgement_userId_fkey";

-- DropTable
DROP TABLE "Judgement";
