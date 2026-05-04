/*
  Warnings:

  - Made the column `identityProof` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
UPDATE "User" SET "identityProof" = 'Pending Verification' WHERE "identityProof" IS NULL;
ALTER TABLE "User" ALTER COLUMN "identityProof" SET NOT NULL,
ALTER COLUMN "identityProof" SET DEFAULT 'Pending Verification';
