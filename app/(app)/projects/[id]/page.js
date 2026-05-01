"use client";
import React from "react";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import BackButton from "@/components/ui/BackButton";

import ProjectDetailMain from "@/components/project/ProjectDetailMain";
import ProjectSidebar from "@/components/project/ProjectSidebar";
import ProjectNotFound from "@/components/project/ProjectNotFound";
import UserProfileModal from "@/components/profile/UserProfileModal";
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
          onDelete={handleDelete}
          requested={requested}
          requestLoading={requestLoading}
          onSendRequest={handleSendRequest}
          onLeaveCollaboration={handleLeaveCollaboration}
          onProfileClick={openProfile}
        />
      </div>

      <UserProfileModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        universityID={selectedUserID}
        zIndex="z-[300]"
      />
    </div>
  );
}
