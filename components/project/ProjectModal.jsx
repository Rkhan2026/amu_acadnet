"use client";
import React from "react";
import { motion } from "framer-motion";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import BaseModal from "@/components/ui/BaseModal";

import { useProjectModal } from "@/hooks/useProjectModal";

import ModalProjectHeader from "./modal/ModalProjectHeader";
import ModalProjectContent from "./modal/ModalProjectContent";
import ModalProjectSidebar from "./modal/ModalProjectSidebar";

const ProjectModal = ({
  isOpen,
  onClose,
  projectID,
  project: initialProject,
  onProfileClick,
  isAdmin: isAdminProp,
  zIndex,
}) => {
  const {
    project,
    loading,
    currentUser,
    requested,
    requestLoading,
    isAdmin,
    isOwner,
    handleSendRequest,
    handleLeaveCollaboration,
    formatStatus,
  } = useProjectModal({
    isOpen,
    projectID,
    initialProject,
    isAdminProp,
  });

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} zIndex={zIndex}>
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-20">
          <LoadingSpinner message="Loading Project Details..." />
        </div>
      ) : project ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto custom-scrollbar"
        >
          <div className="p-8 md:p-12">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Main Content */}
              <div className="flex-1 space-y-10">
                <ModalProjectHeader
                  project={project}
                  isAdmin={isAdmin}
                  isOwner={isOwner}
                  onClose={onClose}
                  onProfileClick={onProfileClick}
                  currentUser={currentUser}
                  formatStatus={formatStatus}
                />
                <ModalProjectContent project={project} />
              </div>

              {/* Sidebar */}
              <ModalProjectSidebar
                project={project}
                currentUser={currentUser}
                isAdmin={isAdmin}
                isOwner={isOwner}
                requested={requested}
                requestLoading={requestLoading}
                handleSendRequest={handleSendRequest}
                handleLeaveCollaboration={handleLeaveCollaboration}
                onProfileClick={onProfileClick}
                formatStatus={formatStatus}
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="p-20 text-center">
          <p className="text-red-500 font-bold">
            Failed to load project details.
          </p>
        </div>
      )}
    </BaseModal>
  );
};

export default ProjectModal;
