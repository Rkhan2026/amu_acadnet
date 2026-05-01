"use client";
import React from "react";
import Feed from "@/components/Feed";
import UserProfileModal from "@/components/UserProfileModal";
import SuggestedCollaborators from "@/components/home/SuggestedCollaborators";

import { useHomeData } from "@/hooks/useHomeData";

export default function HomePage() {
  const {
    suggested,
    loading,
    user,
    selectedUserID,
    isModalOpen,
    setIsModalOpen,
    handleFollow,
    handleUnfollow,
    openProfile,
  } = useHomeData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className={user ? "lg:col-span-2" : "lg:col-span-3"}>
        <Feed />
      </div>

      {user && (
        <div className="hidden lg:block py-8 pr-8 space-y-8">
          <SuggestedCollaborators
            loading={loading}
            suggested={suggested}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
            onProfileClick={openProfile}
          />
        </div>
      )}

      <UserProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        universityID={selectedUserID}
      />
    </div>
  );
}
