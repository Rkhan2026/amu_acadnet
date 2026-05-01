"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import UserProfileModal from "@/components/profile/UserProfileModal";
import AdminRejectionModal from "@/components/ui/AdminRejectionModal";
import AdminHeader from "@/components/admin/AdminHeader";
import { VerificationList } from "@/components/admin/AdminLists";
import { useVerificationData } from "@/hooks/useAdminData";
import { useVerificationActions } from "@/hooks/useVerificationActions";

function VerificationsContent() {
  const searchParams = useSearchParams();
  const [profileUniversityID, setProfileUniversityID] = useState(null);

  const {
    requests,
    setRequests,
    loading,
    mode,
    setMode,
    filteredRequests,
    counts,
  } = useVerificationData(searchParams.get("mode") || "PENDING");

  const {
    rejectionTarget,
    setRejectionTarget,
    isSubmitting,
    submittingId,
    handleAction,
    handleRejectionConfirm,
  } = useVerificationActions(
    requests,
    setRequests,
    profileUniversityID,
    setProfileUniversityID,
  );

  useEffect(() => {
    const m = searchParams.get("mode");
    if (m) setMode(m);
  }, [searchParams, setMode]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <AdminHeader
        title="Academic Verifications"
        description="Manage institutional records and academic affiliations for members of AMU."
        activeTab={mode}
        onTabChange={setMode}
        counts={counts}
        tabs={[
          { label: "Pending", value: "PENDING" },
          { label: "Verified", value: "APPROVED" },
          { label: "Rejected", value: "REJECTED" },
        ]}
      />

      <VerificationList
        loading={loading}
        requests={filteredRequests}
        mode={mode}
        onUserClick={setProfileUniversityID}
        onAction={handleAction}
        submittingId={submittingId}
      />

      <UserProfileModal
        isOpen={!!profileUniversityID}
        onClose={() => setProfileUniversityID(null)}
        universityID={profileUniversityID}
        onAdminAction={handleAction}
        initialAdminFeedback={
          requests.find((r) => r.id === profileUniversityID)?.adminFeedback
        }
      />

      <AdminRejectionModal
        isOpen={!!rejectionTarget}
        onClose={() => setRejectionTarget(null)}
        onSubmit={handleRejectionConfirm}
        isSubmitting={isSubmitting}
        initialFeedback={rejectionTarget?.adminFeedback}
        title="Reject User"
        description="Please provide reason for rejection to help the user update their profile for resubmission."
      />
    </div>
  );
}

export default function VerificationsPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Accessing records..." />}>
      <VerificationsContent />
    </Suspense>
  );
}
