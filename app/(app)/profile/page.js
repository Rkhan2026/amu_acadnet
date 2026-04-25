"use client";
import React, { useState, useEffect } from "react";
import ProfileView from "@/components/ProfileView";
import ProfileEditForm from "@/components/ProfileEditForm";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((authData) => {
        if (!authData.error && authData.user) {
          return fetch(`/api/profile/${authData.user.universityID}`).then(
            (res) => res.json(),
          );
        }
        throw new Error("No session");
      })
      .then((profileData) => {
        if (!profileData.error) {
          setUserData({
            ...profileData,
            avatar: "/default-avatar.svg", // Placeholder
            stats: {
              projects: profileData.createdProjects?.length || 0,
              citations: 0,
              collaborators: [
                ...(profileData.sentCollaborations || []),
                ...(profileData.receivedCollaborations || []),
              ].filter(
                (c) => c.project.universityID !== profileData.universityID,
              ).length,
            },
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (updatedData) => {
    try {
      const res = await fetch(`/api/profile/${userData.universityID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updatedData.name,
          department: updatedData.department,
          biography: updatedData.biography,
          researchInterests: updatedData.researchInterests,
        }),
      });
      if (res.ok) {
        setUserData((prev) => ({ ...prev, ...updatedData }));
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return <LoadingSpinner fullPage message="Loading researcher profile..." />;
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
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <ProfileView user={userData} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
}
