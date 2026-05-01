import { useState, useEffect } from "react";

export function useProfileData() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

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
            avatar:
              profileData.profilePhoto &&
              profileData.profilePhoto !== "/default-avatar.svg"
                ? profileData.profilePhoto
                : null,
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
    setIsSaving(true);
    try {
      const res = await fetch(`/api/profile/${userData.universityID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updatedData.name,
          department: updatedData.department,
          biography: updatedData.biography,
          researchInterests: updatedData.researchInterests,
          profilePhoto: updatedData.profilePhoto,
        }),
      });
      if (res.ok) {
        const freshUser = await res.json();
        setUserData((prev) => ({
          ...prev,
          ...freshUser,
          avatar:
            freshUser.profilePhoto &&
            freshUser.profilePhoto !== "/default-avatar.svg"
              ? freshUser.profilePhoto
              : null,
        }));
        window.dispatchEvent(new Event("user-updated"));
        setIsEditing(false);
      } else {
        const errorData = await res.json();
        setSaveError(
          errorData.error ||
            "Failed to save profile. Please check file size (max 5MB).",
        );
      }
    } catch (err) {
      console.error(err);
      setSaveError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isEditing,
    setIsEditing,
    userData,
    loading,
    isSaving,
    saveError,
    setSaveError,
    handleSave,
  };
}
