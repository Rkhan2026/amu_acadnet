"use client";
import React from "react";
import ProjectIdentity from "@/components/project/ProjectIdentity";
import ProjectSpecifics from "@/components/project/ProjectSpecifics";
import CreateProjectHeader from "@/components/project/CreateProjectHeader";
import CreateProjectActions from "@/components/project/CreateProjectActions";
import ActionSuccess from "@/components/ui/ActionSuccess";
import { useCreateProject } from "@/hooks/useCreateProject";

const CreateProjectPage = () => {
  const {
    isSubmitting,
    isSubmitted,
    formData,
    setFormData,
    showCustomDomain,
    setShowCustomDomain,
    handleSubmit,
    handleChange,
    router,
  } = useCreateProject();

  const domains = [
    "Artificial Intelligence",
    "Social Sciences",
    "Physics",
    "Sustainable Development",
    "Medieval History",
    "Computer Science",
    "Law",
    "Biotechnology",
  ];
  const statuses = ["Proposed", "Active", "On Hold", "Completed", "Archived"];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <ActionSuccess
        isOpen={isSubmitted}
        title="Project Created!"
        description="Your research project has been submitted for moderation. You'll be notified once it's live on the network."
        redirectingText="Redirecting to Home..."
      />

      <CreateProjectHeader />

      <form onSubmit={handleSubmit} className="space-y-8">
        <ProjectIdentity
          formData={formData}
          handleChange={handleChange}
          domains={domains}
          statuses={statuses}
          showCustomDomain={showCustomDomain}
          setShowCustomDomain={setShowCustomDomain}
        />
        <ProjectSpecifics
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
        />

        <CreateProjectActions
          isSubmitting={isSubmitting}
          onCancel={(e) => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              e.preventDefault();
              router.back();
            }
          }}
        />
      </form>
    </div>
  );
};

export default CreateProjectPage;
