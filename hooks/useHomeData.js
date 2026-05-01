import { useState, useEffect } from "react";

export function useHomeData() {
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFollow = async (tid, e) => {
    e.stopPropagation();
    try {
      const res = await fetch("/api/network/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetID: tid }),
      });
      if (res.ok) {
        setSuggested((prev) =>
          prev.map((u) =>
            u.universityID === tid ? { ...u, followingStatus: "PENDING" } : u,
          ),
        );
      }
    } catch (_e) {
      console.error("Follow error:", _e);
    }
  };

  const handleUnfollow = async (tid, e) => {
    e.stopPropagation();
    try {
      const res = await fetch("/api/network/follow", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetID: tid }),
      });
      if (res.ok) {
        setSuggested((prev) =>
          prev.map((u) =>
            u.universityID === tid ? { ...u, followingStatus: null } : u,
          ),
        );
      }
    } catch (_e) {
      console.error("Unfollow error:", _e);
    }
  };

  const openProfile = (uid) => {
    setSelectedUserID(uid);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          return Promise.all([
            fetch("/api/recommendations/collaborators").then((res) =>
              res.json(),
            ),
            fetch("/api/network").then((res) => res.json()),
          ]).then(([recsData, networkData]) => {
            if (
              recsData.recommendations &&
              Array.isArray(recsData.recommendations)
            ) {
              const followMap = {};
              if (networkData.following) {
                networkData.following.forEach((f) => {
                  followMap[f.followingID] = f.requestStatus;
                });
              }
              setSuggested(
                recsData.recommendations.slice(0, 5).map((rec) => ({
                  name: rec.user.name,
                  role: rec.user.role,
                  avatar: "/default-avatar.svg",
                  universityID: rec.user.universityID,
                  researchInterests: rec.user.researchInterests,
                  score: Math.round(rec.score * 100),
                  followingStatus: followMap[rec.user.universityID] || null,
                })),
              );
            }
          });
        }
      })
      .catch((_e) => console.error(_e))
      .finally(() => setLoading(false));
  }, []);

  return {
    suggested,
    loading,
    user,
    selectedUserID,
    isModalOpen,
    setIsModalOpen,
    handleFollow,
    handleUnfollow,
    openProfile,
  };
}
