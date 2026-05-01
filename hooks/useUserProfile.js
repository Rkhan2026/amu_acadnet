"use client";
import { useState, useEffect } from "react";

export function useUserProfile({ isOpen, universityID }) {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingStatus, setFollowingStatus] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [selectedProjectID, setSelectedProjectID] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [prevId, setPrevId] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  if (universityID !== prevId) {
    setPrevId(universityID);
    setLoading(true);
    setUser(null);
    setProjects([]);
  }

  useEffect(() => {
    if (isOpen && universityID) {
      setLoading(true);
      Promise.all([
        fetch(`/api/profile/${universityID}`).then((res) => res.json()),
        fetch(`/api/projects?universityID=${universityID}`).then((res) =>
          res.json(),
        ),
        fetch("/api/auth/me").then((res) => res.json()),
        fetch("/api/network").then((res) => res.json()),
      ])
        .then(([userData, projectData, authData, netData]) => {
          if (!userData.error) {
            setUser(userData);
          }
          if (!projectData.error) {
            setProjects(projectData);
          }
          if (authData.user) {
            setIsOwnProfile(authData.user.universityID === universityID);
            setIsAdmin(authData.user.role?.toUpperCase() === "ADMIN");
            setIsGuest(false);
          } else {
            setIsGuest(true);
          }
          if (!netData.error && netData.following) {
            const rel = netData.following.find(
              (f) => f.followingID === universityID,
            );
            setFollowingStatus(rel ? rel.requestStatus : null);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, universityID]);

  const handleFollowToggle = async () => {
    const isFollowing = !!followingStatus;
    setFollowLoading(true);
    const originalStatus = followingStatus;
    setFollowingStatus(isFollowing ? null : "PENDING");

    try {
      const res = await fetch("/api/network/follow", {
        method: isFollowing ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetID: universityID }),
      });
      if (!res.ok) {
        setFollowingStatus(originalStatus);
        const err = await res.json();
        alert(err.error || "Action failed");
      }
    } catch (err) {
      console.error("Follow toggle error:", err);
      setFollowingStatus(originalStatus);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleProjectClick = (projectID) => {
    setSelectedProjectID(projectID);
    setIsProjectModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return {
    user,
    projects,
    loading,
    isFollowing: followingStatus === "ACCEPTED",
    followingStatus,
    followLoading,
    isOwnProfile,
    isAdmin,
    isGuest,
    isProjectModalOpen,
    selectedProjectID,
    setIsProjectModalOpen,
    handleProjectClick,
    handleFollow: handleFollowToggle,
    handleUnfollow: handleFollowToggle,
    setModalImage,
    modalImage,
    formatDate,
  };
}
