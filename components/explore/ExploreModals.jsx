import React from "react";
import ProjectModal from "@/components/project/ProjectModal";
import UserProfileModal from "@/components/profile/UserProfileModal";

const ExploreModals = ({
  isProjectModalOpen,
  setIsProjectModalOpen,
  selectedProjectID,
  isUserModalOpen,
  setIsUserModalOpen,
  selectedUserID,
  onProfileClick,
}) => (
  <>
    <ProjectModal
      isOpen={isProjectModalOpen}
      onClose={() => setIsProjectModalOpen(false)}
      projectID={selectedProjectID}
      onProfileClick={onProfileClick}
      zIndex="z-[400]"
    />
    <UserProfileModal
      isOpen={isUserModalOpen}
      onClose={() => setIsUserModalOpen(false)}
      universityID={selectedUserID}
      onProfileClick={onProfileClick}
      zIndex="z-[600]"
    />
  </>
);

export default ExploreModals;
