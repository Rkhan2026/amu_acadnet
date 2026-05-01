import { useState } from "react";

export function useModerationActions(
  projects,
  setProjects,
  selectedProject,
  setSelectedProject,
) {
  const [rejectionTarget, setRejectionTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingId, setSubmittingId] = useState(null);

  const handleProjAction = async (id, action) => {
    try {
      if (action === "reject") {
        setRejectionTarget(projects.find((p) => p.id === id));
        return;
      }
      setSubmittingId(id);
      setIsSubmitting(true);
      const moderationStatus = action === "approve" ? "APPROVED" : "REJECTED";
      const res = await fetch(`/api/projects/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moderationStatus }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, moderationStatus } : p)),
        );
        if (selectedProject?.id === id) setSelectedProject(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setSubmittingId(null);
    }
  };

  const handleRejectionConfirm = async (feedback) => {
    if (!rejectionTarget || !feedback.trim()) return;
    setIsSubmitting(true);
    setSubmittingId(rejectionTarget.id);
    try {
      const res = await fetch(`/api/projects/${rejectionTarget.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moderationStatus: "REJECTED",
          adminFeedback: feedback,
        }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === rejectionTarget.id
              ? { ...p, moderationStatus: "REJECTED", adminFeedback: feedback }
              : p,
          ),
        );
        setRejectionTarget(null);
        if (selectedProject?.id === rejectionTarget.id)
          setSelectedProject(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setSubmittingId(null);
    }
  };

  return {
    rejectionTarget,
    setRejectionTarget,
    isSubmitting,
    submittingId,
    handleProjAction,
    handleRejectionConfirm,
  };
}
