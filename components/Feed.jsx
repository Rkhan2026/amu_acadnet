"use client";
import React, { useState } from "react";
import FeedItem from "./FeedItem";
import { Sparkles, Users } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const Feed = () => {
  const [activeTab, setActiveTab] = useState("for-you"); // "for-you" or "following"
  const [feedData, setFeedData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("Recent");

  React.useEffect(() => {
    // Fetch current user
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch(console.error);

    setLoading(true);
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
              domain: p.researchDomain,
              description: p.description,
              leadResearcher: p.creator?.name || "Member",
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
              matchScore: p.moderationStatus === "APPROVED" ? 95 : 0,
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
  }, [activeTab, sortOption]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Feed Tabs */}
      <div className="flex items-center gap-8 mb-10 border-b border-gray-100 pb-0">
        <button
          onClick={() => setActiveTab("for-you")}
          className={`pb-4 px-2 flex items-center gap-2 font-bold transition-all relative ${
            activeTab === "for-you"
              ? "text-amu-green"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Sparkles
            className={`h-5 w-5 ${activeTab === "for-you" ? "text-amu-green" : "text-gray-400"}`}
          />
          For You
          {activeTab === "for-you" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amu-green rounded-t-full mt-auto" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("following")}
          className={`pb-4 px-2 flex items-center gap-2 font-bold transition-all relative ${
            activeTab === "following"
              ? "text-amu-green"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Users
            className={`h-5 w-5 ${activeTab === "following" ? "text-amu-green" : "text-gray-400"}`}
          />
          Following
          {activeTab === "following" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amu-green rounded-t-full mt-auto" />
          )}
        </button>
      </div>

      {/* Feed Header Context */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-xl font-black text-gray-900 tracking-tight">
          {activeTab === "for-you"
            ? "AI Collaboration Recommendations"
            : "Following Updates"}
        </h2>
        <div className="h-px bg-gray-100 flex-1"></div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Sort by:
          </span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-transparent text-[10px] font-black text-amu-green outline-none cursor-pointer uppercase tracking-widest border border-amu-green/20 px-2 py-1 rounded-lg"
          >
            <option value="Recent">Recent</option>
            <option value="Match Score">Match Score</option>
          </select>
        </div>
      </div>

      {/* Publications / Content */}
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {loading ? (
          <LoadingSpinner message="Loading research discovery feed..." />
        ) : feedData.length > 0 ? (
          feedData.map((post) => (
            <FeedItem key={post.id} post={post} currentUser={currentUser} />
          ))
        ) : (
          <div className="text-center py-20 text-gray-400 font-medium">
            No research updates found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
