"use client";
import React from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useResubmitProfile } from "@/hooks/useResubmitProfile";

import ResubmitProfileLayout from "@/components/profile/ResubmitProfileLayout";

export default function ResubmitProfilePage() {
  const {
    loading,
    submitting,
    user,
    formData,
    setFormData,
    fileNames,
    handleFileChange,
    error,
    showSuccessModal,
    handleSubmit,
    handleModalClose,
  } = useResubmitProfile();

  if (loading) return <LoadingSpinner fullPage message="Loading profile..." />;
  if (!user) return null;

  return (
    <ResubmitProfileLayout
      user={user}
      formData={formData}
      setFormData={setFormData}
      fileNames={fileNames}
      handleFileChange={handleFileChange}
      submitting={submitting}
      error={error}
      showSuccessModal={showSuccessModal}
      onSubmit={handleSubmit}
      onModalClose={handleModalClose}
    />
  );
}
