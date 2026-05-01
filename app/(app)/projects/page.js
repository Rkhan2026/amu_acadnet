"use client";
import React from "react";
import ProjectModal from "@/components/project/ProjectModal";
import UserProfileModal from "@/components/profile/UserProfileModal";
import MyProjectGrid from "@/components/project/MyProjectGrid";
import MyProjectsHeader from "@/components/project/MyProjectsHeader";

import { useMyProjects } from "@/hooks/useMyProjects";

export default function MyProjectsPage() {
  const {
    myProjects,
    loading,
    selectedProjectID,
    isModalOpen,
    setIsModalOpen,
    selectedUserID,
    isUserModalOpen,
    setIsUserModalOpen,
    openProject,
    openProfile,
  } = useMyProjects();

  return (
    <div className="py-8 px-4 md:px-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <MyProjectsHeader />

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
        onProfileClick={openProfile}
        zIndex="z-[400]"
      />
    </div>
  );
}
