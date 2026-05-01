"use client";
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";

import ProjectHeader from "@/components/project/ProjectHeader";
import RequirementList from "@/components/project/RequirementList";
import ExternalLinks from "@/components/project/ExternalLinks";
import ProjectSidebar from "@/components/project/ProjectSidebar";
import ProjectDescription from "@/components/project/ProjectDescription";
import ProjectNotFound from "@/components/project/ProjectNotFound";
import { useProjectActions } from "@/hooks/useProjectActions";

export default function ProjectDetailPage() {
  const router = useRouter();
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
  } = useProjectActions(projectId);

  const [newRequirement, setNewRequirement] = useState("");

  const handleGoBack = (e) => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  };

  if (loading)
    return <LoadingSpinner fullPage message="Loading project data..." />;
  if (!project) return <ProjectNotFound onBack={handleGoBack} />;

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link
          href={isOwner ? "/projects" : "/explore"}
          onClick={handleGoBack}
          className="group flex items-center gap-2 text-gray-400 hover:text-amu-green font-bold mb-10 transition-colors uppercase tracking-widest text-[10px] w-fit"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />{" "}
          Go Back
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <ProjectHeader
            project={project}
            isEditing={isEditing}
            editForm={editForm}
            setEditForm={setEditForm}
            isOwner={isOwner}
          />

          <ProjectDescription
            isEditing={isEditing}
            description={isEditing ? editForm.description : project.description}
            onChange={(val) => setEditForm({ ...editForm, description: val })}
          />

          <RequirementList
            isEditing={isEditing}
            requirements={
              isEditing ? editForm.requirements : project.requirements
            }
            onAdd={(skill) =>
              setEditForm({
                ...editForm,
                requirements: [...editForm.requirements, skill.toLowerCase()],
              })
            }
            onRemove={(idx) =>
              setEditForm({
                ...editForm,
                requirements: editForm.requirements.filter((_, i) => i !== idx),
              })
            }
            inputValue={newRequirement}
            onInputChange={setNewRequirement}
          />

          <ExternalLinks
            isEditing={isEditing}
            links={isEditing ? editForm.externalLinks : project.externalLinks}
            onAdd={() =>
              setEditForm({
                ...editForm,
                externalLinks: [...editForm.externalLinks, { url: "" }],
              })
            }
            onRemove={(idx) =>
              setEditForm({
                ...editForm,
                externalLinks: editForm.externalLinks.filter(
                  (_, i) => i !== idx,
                ),
              })
            }
            onChange={(idx, val) => {
              const next = [...editForm.externalLinks];
              next[idx] = { url: val };
              setEditForm({ ...editForm, externalLinks: next });
            }}
          />
        </div>

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
        />
      </div>
    </div>
  );
}
