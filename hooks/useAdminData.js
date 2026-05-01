import { useState, useEffect, useMemo } from "react";

export function useModerationData(initialMode) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setProjects(
            data.map((p) => ({
              id: p.projectID,
              title: p.title,
              author: p.creator?.name || "Unknown",
              department: p.creator?.department || "",
              domain: p.projectDomain || p.type,
              moderationStatus: p.moderationStatus,
              type: p.projectDomain,
              rawDate: p.createdAt || Date.now(),
              submittedAt: new Date(p.createdAt || Date.now()).toLocaleString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                },
              ),
              description: p.description,
              adminFeedback: p.adminFeedback,
              projectStatus: p.projectStatus,
              externalLinks: p.externalLinks?.map((url) => ({ url })),
              creatorID: p.universityID,
              team: p.teamMembers?.map((m) => ({
                universityID: m.universityID,
                name: m.name,
                role: m.role || "Researcher",
                profilePhoto: m.profilePhoto,
              })),
              creator: p.creator,
            })),
          );
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => p.moderationStatus === mode)
      .sort((a, b) => new Date(b.rawDate || 0) - new Date(a.rawDate || 0));
  }, [projects, mode]);

  const counts = useMemo(() => {
    return {
      PENDING: projects.filter((p) => p.moderationStatus === "PENDING").length,
      APPROVED: projects.filter((p) => p.moderationStatus === "APPROVED")
        .length,
      REJECTED: projects.filter((p) => p.moderationStatus === "REJECTED")
        .length,
    };
  }, [projects]);

  return {
    projects,
    setProjects,
    loading,
    mode,
    setMode,
    filteredProjects,
    counts,
  };
}

export function useVerificationData(initialMode) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setRequests(
            data.map((u) => ({
              id: u.universityID,
              universityId: u.universityID,
              name: u.name,
              email: u.email,
              role: u.role,
              accountStatus: u.accountStatus,
              adminFeedback: u.adminFeedback,
              department: u.department,
              rawDate: u.createdAt || Date.now(),
              appliedAt: new Date(u.createdAt || Date.now()).toLocaleString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                },
              ),
              avatar: u.profilePhoto || "/default-avatar.svg",
              identityProof: u.identityProof,
              biography:
                u.academicProfile?.biography || "No biography provided.",
              researchInterests: u.academicProfile?.researchInterests
                ? u.academicProfile.researchInterests
                    .split(",")
                    .map((s) => s.trim())
                : ["Unspecified"],
            })),
          );
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredRequests = useMemo(() => {
    return requests
      .filter((r) => r.accountStatus === mode)
      .sort((a, b) => new Date(b.rawDate || 0) - new Date(a.rawDate || 0));
  }, [requests, mode]);

  const counts = useMemo(() => {
    return {
      PENDING: requests.filter((r) => r.accountStatus === "PENDING").length,
      APPROVED: requests.filter((r) => r.accountStatus === "APPROVED").length,
      REJECTED: requests.filter((r) => r.accountStatus === "REJECTED").length,
    };
  }, [requests]);

  return {
    requests,
    setRequests,
    loading,
    mode,
    setMode,
    filteredRequests,
    counts,
  };
}
