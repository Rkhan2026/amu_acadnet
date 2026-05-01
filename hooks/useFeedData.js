import { useState, useEffect } from "react";

export function useFeedData(activeTab, sortOption) {
  const [feedData, setFeedData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(true), 0);
    Promise.all([fetch("/api/projects"), fetch("/api/network")])
      .then(async ([projectsRes, networkRes]) => {
        const projectsData = await projectsRes.json();
        const networkData = await networkRes.json();

        if (Array.isArray(projectsData)) {
          const sentCollabIds = new Set(
            (networkData.sentCollaborations || []).map((c) => c.projectID),
          );
          const followingIds = new Set(
            (networkData.following || [])
              .filter((f) => f.requestStatus === "ACCEPTED")
              .map((f) => f.followingID),
          );

          const filtered = projectsData
            .filter((p) => p.moderationStatus === "APPROVED")
            .filter(
              (p) =>
                activeTab === "for-you" || followingIds.has(p.universityID),
            )
            .map((p) => ({
              id: p.projectID,
              title: p.title,
              domain: p.projectDomain,
              description: p.description,
              projectCreator: p.creator?.name || "Member",
              ownerID: p.universityID,
              projectStatus:
                p.projectStatus === "ACTIVE"
                  ? "Active"
                  : p.projectStatus === "ON_HOLD"
                    ? "On Hold"
                    : p.projectStatus === "PROPOSED"
                      ? "Proposed"
                      : p.projectStatus === "COMPLETED"
                        ? "Completed"
                        : "Archived",
              matchScore: p.matchScore || 0,
              createdAt: p.createdAt,
              hasRequested: sentCollabIds.has(p.projectID),
            }));

          const sorted = [...filtered].sort((a, b) => {
            if (sortOption === "Recent")
              return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortOption === "Match Score")
              return b.matchScore - a.matchScore;
            return 0;
          });

          setFeedData(sorted);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    return () => clearTimeout(timer);
  }, [activeTab, sortOption]);

  return { feedData, currentUser, loading };
}
