"use client";
import React from "react";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import BackButton from "@/components/ui/BackButton";

import ProjectDetailMain from "@/components/project/ProjectDetailMain";
import ProjectSidebar from "@/components/project/ProjectSidebar";
import ProjectNotFound from "@/components/project/ProjectNotFound";
import UserProfileModal from "@/components/profile/UserProfileModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useProjectActions } from "@/hooks/useProjectActions";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id;

  const {
    project,
    loading,
    isEditing,
    setIsEditing,
    editForm,
    setEditForm,
    isSaving,
    isOwner,
    handleSave,
    handleDelete,
    requested,
    requestLoading,
    handleSendRequest,
    handleLeaveCollaboration,
    handleGoBack,
    newRequirement,
    setNewRequirement,
    addRequirement,
    removeRequirement,
    addExternalLink,
    removeExternalLink,
    updateExternalLink,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isLeaveModalOpen,
    setIsLeaveModalOpen,
  } = useProjectActions(projectId);

  const [selectedUserID, setSelectedUserID] = React.useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = React.useState(false);

  const openProfile = (uid) => {
    setSelectedUserID(uid);
    setIsUserModalOpen(true);
  };

  if (loading)
    return <LoadingSpinner fullPage message="Loading project data..." />;
  if (!project) return <ProjectNotFound onBack={handleGoBack} />;

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <BackButton
        href={isOwner ? "/projects" : "/explore"}
        onClick={handleGoBack}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <ProjectDetailMain
          project={project}
          isEditing={isEditing}
          editForm={editForm}
          setEditForm={setEditForm}
          isOwner={isOwner}
          addRequirement={addRequirement}
          removeRequirement={removeRequirement}
          newRequirement={newRequirement}
          setNewRequirement={setNewRequirement}
          addExternalLink={addExternalLink}
          removeExternalLink={removeExternalLink}
          updateExternalLink={updateExternalLink}
          onProfileClick={openProfile}
        />

        <ProjectSidebar
          project={project}
          isEditing={isEditing}
          editForm={editForm}
          setEditForm={setEditForm}
          isOwner={isOwner}
          isSaving={isSaving}
          onSave={isEditing ? handleSave : () => setIsEditing(true)}
          onCancel={() => setIsEditing(false)}
          onDelete={() => setIsDeleteModalOpen(true)}
          requested={requested}
          requestLoading={requestLoading}
          onSendRequest={handleSendRequest}
          onLeaveCollaboration={() => setIsLeaveModalOpen(true)}
          onProfileClick={openProfile}
        />
      </div>

      <UserProfileModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        universityID={selectedUserID}
        zIndex="z-[300]"
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone and all collaboration data will be lost."
        confirmText="Delete Project"
        variant="danger"
      />

      <ConfirmationModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={handleLeaveCollaboration}
        title="Leave Project"
        message="Are you sure you want to leave this project? You will need to request collaboration again if you change your mind."
        confirmText="Leave Project"
        variant="warning"
      />
    </div>
  );
}
