"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import Image from "next/image";

import ProjectModal from "@/components/project/ProjectModal";
import BaseModal from "@/components/ui/BaseModal";
import { useUserProfile } from "@/hooks/useUserProfile";

import ModalProfileHeader from "./modal/ModalProfileHeader";
import ModalBiography from "./modal/ModalBiography";
import ModalProjects from "./modal/ModalProjects";
import ModalCollaborations from "./modal/ModalCollaborations";
import ModalSidebar from "./modal/ModalSidebar";
import ProjectInviteModal from "./modal/ProjectInviteModal";

const UserProfileModal = ({
  isOpen,
  onClose,
  universityID,
  zIndex = "z-[500]",
  onProfileClick: onProfileClickProp,
}) => {
  const {
    user,
    projects,
    loading,
    isFollowing,
    followingStatus,
    followLoading,
    isOwnProfile,
    isAdmin,
    isGuest,
    isProjectModalOpen,
    selectedProjectID,
    setIsProjectModalOpen,
    handleProjectClick,
    handleFollow,
    handleUnfollow,
    setModalImage,
    modalImage,
    formatDate,
  } = useUserProfile({ isOpen, universityID });

  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);

  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} zIndex={zIndex}>
      <div className="relative bg-white min-h-[600px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20">
            <Loader2 className="h-12 w-12 text-amu-green animate-spin mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
              Retrieving Profile...
            </p>
          </div>
        ) : user ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 overflow-y-auto custom-scrollbar pb-20"
          >
            <ModalProfileHeader user={user} setModalImage={setModalImage} />

            <div className="px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-10">
                <ModalBiography biography={user.academicProfile?.biography} />

                <ModalProjects
                  projects={projects}
                  onProjectClick={handleProjectClick}
                />

                <ModalCollaborations
                  collaborations={[
                    ...(user.sentCollaborations || []),
                    ...(user.receivedCollaborations || []),
                    ...(user.workingProjects || []).map((p) => ({
                      project: p,
                    })),
                  ].reduce((acc, current) => {
                    const isDuplicate = acc.some(
                      (item) =>
                        item.project.projectID === current.project.projectID,
                    );
                    const isOwnProject =
                      current.project.universityID === user.universityID;

                    if (!isDuplicate && !isOwnProject) {
                      acc.push(current);
                    }
                    return acc;
                  }, [])}
                  onProjectClick={handleProjectClick}
                />
              </div>

              <ModalSidebar
                user={user}
                isFollowing={isFollowing}
                followingStatus={followingStatus}
                followLoading={followLoading}
                isOwnProfile={isOwnProfile}
                isAdmin={isAdmin}
                isGuest={isGuest}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
                onInvite={() => setIsInviteModalOpen(true)}
                formatDate={formatDate}
              />
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 flex items-center justify-center py-40 text-gray-400 font-bold uppercase tracking-widest text-xs">
            Researcher profile not found.
          </div>
        )}

        <AnimatePresence>
          {modalImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalImage(null)}
              className="fixed inset-0 z-[600] bg-black/90 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
            >
              <div className="relative max-w-5xl w-full h-full">
                <Image
                  src={modalImage}
                  alt="Profile Large"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          projectID={selectedProjectID}
          onProfileClick={(uid) => {
            onProfileClickProp?.(uid);
            setIsProjectModalOpen(false);
          }}
          zIndex="z-[700]"
        />

        <ProjectInviteModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          targetUser={user}
        />
      </div>
    </BaseModal>
  );
};

export default UserProfileModal;
