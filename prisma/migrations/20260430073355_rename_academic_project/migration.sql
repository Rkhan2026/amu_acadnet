/*
  Warnings:

  - You are about to drop the `ResearchProject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Collaboration" DROP CONSTRAINT "Collaboration_projectID_fkey";

-- DropForeignKey
ALTER TABLE "ResearchProject" DROP CONSTRAINT "ResearchProject_adminID_fkey";

-- DropForeignKey
ALTER TABLE "ResearchProject" DROP CONSTRAINT "ResearchProject_universityID_fkey";

-- DropForeignKey
ALTER TABLE "_UserWorksOnProject" DROP CONSTRAINT "_UserWorksOnProject_A_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "adminFeedback" TEXT DEFAULT 'No feedback yet',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "identityProof" TEXT,
ADD COLUMN     "profilePhoto" TEXT DEFAULT '/default-avatar.svg';

-- DropTable
DROP TABLE "ResearchProject";

-- CreateTable
CREATE TABLE "AcademicProject" (
    "projectID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT[],
    "projectDomain" TEXT NOT NULL,
    "moderationStatus" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "projectStatus" "ProjectStatus" NOT NULL DEFAULT 'PROPOSED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "externalLinks" TEXT[],
    "universityID" TEXT NOT NULL,
    "adminFeedback" TEXT DEFAULT 'No feedback yet',

    CONSTRAINT "AcademicProject_pkey" PRIMARY KEY ("projectID")
);

-- AddForeignKey
ALTER TABLE "AcademicProject" ADD CONSTRAINT "AcademicProject_universityID_fkey" FOREIGN KEY ("universityID") REFERENCES "User"("universityID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaboration" ADD CONSTRAINT "Collaboration_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "AcademicProject"("projectID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserWorksOnProject" ADD CONSTRAINT "_UserWorksOnProject_A_fkey" FOREIGN KEY ("A") REFERENCES "AcademicProject"("projectID") ON DELETE CASCADE ON UPDATE CASCADE;
