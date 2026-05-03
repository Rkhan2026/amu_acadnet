"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ModerationModals from "@/components/admin/ModerationModals";
import AdminHeader from "@/components/admin/AdminHeader";
import { ModerationList } from "@/components/admin/AdminLists";
import { useModerationData } from "@/hooks/useAdminData";
import { useModerationActions } from "@/hooks/useModerationActions";

function ModerationContent() {
  const searchParams = useSearchParams();
  const [selectedProject, setSelectedProject] = useState(null);
  const [profileUniversityID, setProfileUniversityID] = useState(null);

  const {
    projects,
    setProjects,
    loading,
    mode,
    setMode,
    filteredProjects,
    counts,
  } = useModerationData(searchParams.get("mode") || "PENDING");

  const {
    rejectionTarget,
    setRejectionTarget,
    isSubmitting,
    submittingId,
    handleProjAction,
    handleRejectionConfirm,
  } = useModerationActions(
    projects,
    setProjects,
    selectedProject,
    setSelectedProject,
  );

  useEffect(() => {
    const m = searchParams.get("mode");
    if (m) setMode(m);
  }, [searchParams, setMode]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <AdminHeader
        title="Admin Moderation"
        description="Manage institutional data integrity for academic projects."
        activeTab={mode}
        onTabChange={setMode}
        counts={counts}
        tabs={[
          { label: "Pending", value: "PENDING" },
          { label: "Approved", value: "APPROVED" },
          { label: "Rejected", value: "REJECTED" },
        ]}
      />

      <ModerationList
        loading={loading}
        projects={filteredProjects}
        mode={mode}
        onProjectClick={setSelectedProject}
        onAction={handleProjAction}
        submittingId={submittingId}
      />

      <ModerationModals
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        profileUniversityID={profileUniversityID}
        setProfileUniversityID={setProfileUniversityID}
        rejectionTarget={rejectionTarget}
        setRejectionTarget={setRejectionTarget}
        handleRejectionConfirm={handleRejectionConfirm}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default function ModerationPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Accessing records..." />}>
      <ModerationContent />
    </Suspense>
  );
}
