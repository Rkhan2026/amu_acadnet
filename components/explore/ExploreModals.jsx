import React from "react";
import ProjectModal from "@/components/ProjectModal";
import UserProfileModal from "@/components/UserProfileModal";

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
      zIndex="z-[300]"
    />
    <UserProfileModal
      isOpen={isUserModalOpen}
      onClose={() => setIsUserModalOpen(false)}
      universityID={selectedUserID}
      zIndex="z-[400]"
    />
  </>
);

export default ExploreModals;
