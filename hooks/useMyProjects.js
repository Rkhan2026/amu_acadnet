"use client";
import { useState, useEffect } from "react";

export function useMyProjects() {
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectID, setSelectedProjectID] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const openProject = (pid) => {
    setSelectedProjectID(pid);
    setIsModalOpen(true);
  };

  const openProfile = (uid) => {
    setSelectedUserID(uid);
    setIsUserModalOpen(true);
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
    ])
      .then(([authRes, projRes]) => {
        if (!authRes.error && !projRes.error) {
          const mine = projRes.filter(
            (p) => p.universityID === authRes.user?.universityID,
          );
          setMyProjects(
            mine.map((p) => ({
              id: p.projectID,
              title: p.title,
              domain: p.projectDomain,
              projectStatus:
                p.projectStatus === "ACTIVE"
                  ? "Active"
                  : p.projectStatus === "ON_HOLD"
                    ? "On Hold"
                    : p.projectStatus === "PROPOSED"
                      ? "Proposed"
                      : p.projectStatus === "ARCHIVED"
                        ? "Archived"
                        : "Completed",
              approvalStatus:
                p.moderationStatus === "APPROVED"
                  ? "Approved"
                  : p.moderationStatus === "PENDING"
                    ? "Pending"
                    : "Rejected",
              description: p.description || "No description provided.",
              time: new Date(p.createdAt).toLocaleDateString(),
            })),
          );
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return {
    myProjects,
    loading,
    selectedProjectID,
    isModalOpen,
    setIsModalOpen,
    selectedUserID,
    isUserModalOpen,
    setIsUserModalOpen,
    openProject,
    openProfile,
  };
}
