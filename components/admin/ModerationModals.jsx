import React from "react";
import ProjectModal from "@/components/project/ProjectModal";
import UserProfileModal from "@/components/profile/UserProfileModal";
import AdminRejectionModal from "@/components/ui/AdminRejectionModal";

const ModerationModals = ({
  selectedProject,
  setSelectedProject,
  profileUniversityID,
  setProfileUniversityID,
  rejectionTarget,
  setRejectionTarget,
  handleRejectionConfirm,
  isSubmitting,
}) => (
  <>
    {selectedProject && (
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onProfileClick={setProfileUniversityID}
        isAdmin={true}
      />
    )}

    <UserProfileModal
      isOpen={!!profileUniversityID}
      onClose={() => setProfileUniversityID(null)}
      universityID={profileUniversityID}
      onProfileClick={setProfileUniversityID}
    />

    <AdminRejectionModal
      isOpen={!!rejectionTarget}
      onClose={() => setRejectionTarget(null)}
      onSubmit={handleRejectionConfirm}
      isSubmitting={isSubmitting}
      initialFeedback={rejectionTarget?.adminFeedback}
      title="Reject Project"
      description="Please provide reason for rejection to help the creator update their project for resubmission."
    />
  </>
);

export default ModerationModals;
