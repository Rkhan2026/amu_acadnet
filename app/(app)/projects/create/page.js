"use client";
import React from "react";
import { PlusCircle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import ProjectIdentity from "@/components/project/ProjectIdentity";
import ProjectSpecifics from "@/components/project/ProjectSpecifics";
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

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amu-green/10 rounded-xl">
            <PlusCircle className="h-6 w-6 text-amu-green" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Create New Project
          </h1>
        </div>
        <p className="text-gray-500 font-medium text-lg">
          Initialize your research project with institutional metadata defined
          in the project schema.
        </p>
      </div>

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

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-amu-green text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-amu-green/20 flex items-center justify-center gap-3 hover:bg-amu-green/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Initializing
                Project...
              </>
            ) : (
              <>
                <PlusCircle className="h-5 w-5" /> Register Research Project{" "}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          <Link
            href="/projects"
            onClick={(e) => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                e.preventDefault();
                router.back();
              }
            }}
            className="px-10 bg-gray-100 text-gray-400 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-200 hover:text-gray-600 transition-all flex items-center justify-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectPage;
