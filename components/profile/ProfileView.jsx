"use client";
import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

import ProfileHeader from "./ProfileHeader";
import BiographySection from "./BiographySection";
import ProjectsSection from "./ProjectsSection";
import ContactSidebar from "./ContactSidebar";
import ProjectModal from "@/components/project/ProjectModal";
import UserProfileModal from "./UserProfileModal";

const ProfileView = ({ user, onEdit }) => {
  const [modalImage, setModalImage] = useState(null);
  const [selectedProjectID, setSelectedProjectID] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const openProject = (pid) => {
    setSelectedProjectID(pid);
    setIsProjectModalOpen(true);
  };

  const openProfile = (uid) => {
    setSelectedUserID(uid);
    setIsUserModalOpen(true);
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ProfileHeader
        user={user}
        onEdit={onEdit}
        setModalImage={setModalImage}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <BiographySection user={user} />
          <ProjectsSection user={user} onProjectClick={openProject} />
        </div>
        <ContactSidebar user={user} setModalImage={setModalImage} />
      </div>

      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setModalImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors bg-black/50 rounded-full z-10"
            >
              <X className="h-6 w-6" />
            </button>
            <Image
              src={
                modalImage.match(/\.[a-zA-Z0-9]+$/)
                  ? modalImage
                  : `${modalImage}.jpg`
              }
              alt="Preview"
              width={1200}
              height={800}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projectID={selectedProjectID}
        onProfileClick={openProfile}
      />

      <UserProfileModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        universityID={selectedUserID}
      />
    </div>
  );
};

export default ProfileView;
