import { useState } from "react";

export function useVerificationActions(
  requests,
  setRequests,
  profileUniversityID,
  setProfileUniversityID,
) {
  const [rejectionTarget, setRejectionTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingId, setSubmittingId] = useState(null);

  const handleAction = async (id, action) => {
    try {
      if (action === "reject") {
        setRejectionTarget(requests.find((r) => r.id === id));
        return;
      }
      setSubmittingId(id);
      setIsSubmitting(true);
      const accountStatus = action === "approve" ? "APPROVED" : "REJECTED";
      const res = await fetch(`/api/admin/users/${id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountStatus }),
      });
      if (res.ok) {
        setRequests((prev) =>
          prev.map((req) => (req.id === id ? { ...req, accountStatus } : req)),
        );
        if (profileUniversityID === id) setProfileUniversityID(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setSubmittingId(null);
    }
  };

  const handleRejectionConfirm = async (comment) => {
    if (!rejectionTarget || !comment.trim()) return;
    setIsSubmitting(true);
    setSubmittingId(rejectionTarget.id);
    try {
      const res = await fetch(`/api/admin/users/${rejectionTarget.id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountStatus: "REJECTED",
          adminFeedback: comment,
        }),
      });
      if (res.ok) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === rejectionTarget.id
              ? { ...req, accountStatus: "REJECTED", adminFeedback: comment }
              : req,
          ),
        );
        setRejectionTarget(null);
        if (profileUniversityID === rejectionTarget.id)
          setProfileUniversityID(null);
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
    handleAction,
    handleRejectionConfirm,
  };
}
