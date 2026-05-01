"use client";
import React from "react";
import ProfileView from "@/components/profile/ProfileView";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

import { useProfileData } from "@/hooks/useProfileData";

export default function ProfilePage() {
  const {
    isEditing,
    setIsEditing,
    userData,
    loading,
    isSaving,
    saveError,
    setSaveError,
    handleSave,
  } = useProfileData();

  if (loading)
    return <LoadingSpinner fullPage message="Loading User Profile..." />;
  if (!userData)
    return (
      <div className="py-20 text-center text-red-400 font-medium font-black uppercase tracking-widest text-xs">
        Profile failed to load.
      </div>
    );

  return (
    <div className="py-8 px-4 md:px-8 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          Academic Profile
        </h1>
      </div>

      {isEditing ? (
        <ProfileEditForm
          user={userData}
          onSave={handleSave}
          onCancel={() => {
            setIsEditing(false);
            setSaveError("");
          }}
          isSaving={isSaving}
          externalError={saveError}
        />
      ) : (
        <ProfileView user={userData} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
}
