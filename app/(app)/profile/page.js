"use client";
import React, { useState } from "react";
import ProfileView from "@/components/ProfileView";
import ProfileEditForm from "@/components/ProfileEditForm";
import { CURRENT_USER } from "@/lib/dummyData";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(CURRENT_USER);

  const handleSave = (updatedData) => {
    setUserData((prev) => ({
      ...prev,
      ...updatedData,
      lastUpdated: new Date().toISOString(),
    }));
    setIsEditing(false);
    // In a real app, you would make an API call here to persist the data
  };

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
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <ProfileView user={userData} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
}
