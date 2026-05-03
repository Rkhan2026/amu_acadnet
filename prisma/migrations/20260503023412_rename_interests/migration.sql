/*
  Warnings:

  - You are about to drop the column `researchInterests` on the `AcademicProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AcademicProfile" DROP COLUMN "researchInterests",
ADD COLUMN     "interestsSkills" TEXT[];
