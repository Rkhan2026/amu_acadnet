import React from "react";
import { BookOpen, CheckCircle2 } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProjectCard from "./ProjectCard";
import VerificationCard from "./VerificationCard";
import EmptyState from "@/components/ui/EmptyState";

export const ModerationList = ({
  loading,
  projects,
  mode,
  onProjectClick,
  onAction,
  submittingId,
}) => {
  if (loading) return <LoadingSpinner message="Loading records..." />;

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title={
          mode === "PENDING"
            ? "All caught up!"
            : mode === "APPROVED"
              ? "No Approved Projects"
              : "No Rejected Projects"
        }
        description={
          mode === "PENDING"
            ? "No pending research projects to review."
            : mode === "APPROVED"
              ? "The institutional research registry currently has no approved projects."
              : "There are no projects in the rejection audit history."
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {projects.map((proj) => (
        <ProjectCard
          key={proj.id}
          project={proj}
          onClick={onProjectClick}
          onAction={onAction}
          isSubmitting={submittingId === proj.id}
        />
      ))}
    </div>
  );
};

export const VerificationList = ({
  loading,
  requests,
  mode,
  onUserClick,
  onAction,
  submittingId,
}) => {
  if (loading) return <LoadingSpinner message="Loading records..." />;

  if (requests.length === 0) {
    return (
      <EmptyState
        icon={CheckCircle2}
        color="green"
        title={
          mode === "PENDING"
            ? "Queue is Clear!"
            : mode === "APPROVED"
              ? "No Verified Users"
              : "No Rejection History"
        }
        description={
          mode === "PENDING"
            ? "All academic profiles have been successfully verified."
            : mode === "APPROVED"
              ? "The institutional registry currently has no verified members."
              : "There are no users currently in the rejected state."
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {requests.map((req) => (
        <VerificationCard
          key={req.id}
          request={req}
          onClick={(user) => onUserClick(user.universityId)}
          onAction={onAction}
          isSubmitting={submittingId === req.id}
        />
      ))}
    </div>
  );
};
