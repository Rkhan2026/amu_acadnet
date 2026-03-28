-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PROPOSED', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "Admin" (
    "adminID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminID")
);

-- CreateTable
CREATE TABLE "User" (
    "universityID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "accountStatus" "AccountStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "User_pkey" PRIMARY KEY ("universityID")
);

-- CreateTable
CREATE TABLE "AcademicProfile" (
    "profileID" TEXT NOT NULL,
    "universityID" TEXT NOT NULL,
    "researchInterests" TEXT NOT NULL,
    "biography" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicProfile_pkey" PRIMARY KEY ("profileID")
);

-- CreateTable
CREATE TABLE "ResearchProject" (
    "projectID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "researchDomain" TEXT NOT NULL,
    "moderationStatus" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "projectStatus" "ProjectStatus" NOT NULL DEFAULT 'PROPOSED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "externalLinks" TEXT[],
    "universityID" TEXT NOT NULL,
    "adminID" TEXT,

    CONSTRAINT "ResearchProject_pkey" PRIMARY KEY ("projectID")
);

-- CreateTable
CREATE TABLE "Collaboration" (
    "requestID" TEXT NOT NULL,
    "projectID" TEXT NOT NULL,
    "senderID" TEXT NOT NULL,
    "receiverID" TEXT NOT NULL,
    "requestStatus" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Collaboration_pkey" PRIMARY KEY ("requestID")
);

-- CreateTable
CREATE TABLE "Follows" (
    "followID" TEXT NOT NULL,
    "followerID" TEXT NOT NULL,
    "followingID" TEXT NOT NULL,
    "requestStatus" "RequestStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Follows_pkey" PRIMARY KEY ("followID")
);

-- CreateTable
CREATE TABLE "_UserWorksOnProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserWorksOnProject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicProfile_universityID_key" ON "AcademicProfile"("universityID");

-- CreateIndex
CREATE UNIQUE INDEX "Follows_followerID_followingID_key" ON "Follows"("followerID", "followingID");

-- CreateIndex
CREATE INDEX "_UserWorksOnProject_B_index" ON "_UserWorksOnProject"("B");

-- AddForeignKey
ALTER TABLE "AcademicProfile" ADD CONSTRAINT "AcademicProfile_universityID_fkey" FOREIGN KEY ("universityID") REFERENCES "User"("universityID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchProject" ADD CONSTRAINT "ResearchProject_universityID_fkey" FOREIGN KEY ("universityID") REFERENCES "User"("universityID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchProject" ADD CONSTRAINT "ResearchProject_adminID_fkey" FOREIGN KEY ("adminID") REFERENCES "Admin"("adminID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaboration" ADD CONSTRAINT "Collaboration_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "ResearchProject"("projectID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaboration" ADD CONSTRAINT "Collaboration_senderID_fkey" FOREIGN KEY ("senderID") REFERENCES "User"("universityID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaboration" ADD CONSTRAINT "Collaboration_receiverID_fkey" FOREIGN KEY ("receiverID") REFERENCES "User"("universityID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followerID_fkey" FOREIGN KEY ("followerID") REFERENCES "User"("universityID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followingID_fkey" FOREIGN KEY ("followingID") REFERENCES "User"("universityID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserWorksOnProject" ADD CONSTRAINT "_UserWorksOnProject_A_fkey" FOREIGN KEY ("A") REFERENCES "ResearchProject"("projectID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserWorksOnProject" ADD CONSTRAINT "_UserWorksOnProject_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("universityID") ON DELETE CASCADE ON UPDATE CASCADE;
