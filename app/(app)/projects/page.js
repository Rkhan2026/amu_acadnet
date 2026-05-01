"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProjectModal from "@/components/ProjectModal";
import UserProfileModal from "@/components/UserProfileModal";
import MyProjectGrid from "@/components/project/MyProjectGrid";

export default function MyProjectsPage() {
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectID, setSelectedProjectID] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const openProject = (pid) => {
    setSelectedProjectID(pid);
    setIsModalOpen(true);
  };

  const openProfile = (uid) => {
    setSelectedUserID(uid);
    setIsUserModalOpen(true);
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
    ])
      .then(([authRes, projRes]) => {
        if (!authRes.error && !projRes.error) {
          const mine = projRes.filter(
            (p) => p.universityID === authRes.user?.universityID,
          );
          setMyProjects(
            mine.map((p) => ({
              id: p.projectID,
              title: p.title,
              domain: p.projectDomain,
              projectStatus:
                p.projectStatus === "ACTIVE"
                  ? "Active"
                  : p.projectStatus === "ON_HOLD"
                    ? "On Hold"
                    : p.projectStatus === "PROPOSED"
                      ? "Proposed"
                      : p.projectStatus === "ARCHIVED"
                        ? "Archived"
                        : "Completed",
              approvalStatus:
                p.moderationStatus === "APPROVED"
                  ? "Approved"
                  : p.moderationStatus === "PENDING"
                    ? "Pending"
                    : "Rejected",
              description: p.description || "No description provided.",
              time: new Date(p.createdAt).toLocaleDateString(),
            })),
          );
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-8 px-4 md:px-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            My Projects
          </h1>
          <p className="text-gray-500 font-medium">
            Manage your research projects, track progress, and create new
            initiatives.
          </p>
        </div>
        <Link
          href="/projects/create"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-amu-green text-white font-bold rounded-2xl hover:bg-[#004d26] transition-all shadow-xl shadow-amu-green/20"
        >
          <Plus className="h-5 w-5" />
          Create New Project
        </Link>
      </div>

      <MyProjectGrid
        loading={loading}
        projects={myProjects}
        onOpen={openProject}
      />

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectID={selectedProjectID}
        onProfileClick={openProfile}
        zIndex="z-[300]"
      />

      <UserProfileModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        universityID={selectedUserID}
        zIndex="z-[400]"
      />
    </div>
  );
}
