"use client";
import React, { useState } from "react";
import FeedItem from "./FeedItem";
import { Sparkles, Users } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import UserProfileModal from "./UserProfileModal";
import ProjectModal from "./ProjectModal";
import { useFeedData } from "@/hooks/useFeedData";

const Feed = () => {
  const [activeTab, setActiveTab] = useState("for-you");
  const [sortOption, setSortOption] = useState("Recent");
  const { feedData, currentUser, loading } = useFeedData(activeTab, sortOption);

  const [selectedUserID, setSelectedUserID] = useState(null);
  const [selectedProjectID, setSelectedProjectID] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const openProfile = (uid) => {
    setSelectedUserID(uid);
    setIsUserModalOpen(true);
  };
  const openProject = (pid) => {
    setSelectedProjectID(pid);
    setIsProjectModalOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {currentUser && (
        <div className="flex items-center gap-8 mb-10 border-b border-gray-100 pb-0">
          {[
            { id: "for-you", label: "For You", icon: Sparkles },
            { id: "following", label: "Following", icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 flex items-center gap-2 font-bold transition-all relative ${activeTab === tab.id ? "text-amu-green" : "text-gray-400 hover:text-gray-600"}`}
            >
              <tab.icon
                className={`h-5 w-5 ${activeTab === tab.id ? "text-amu-green" : "text-gray-400"}`}
              />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-amu-green rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-xl font-black text-gray-900 tracking-tight">
          {currentUser
            ? activeTab === "for-you"
              ? "AI Collaboration Recommendations"
              : "Following Updates"
            : "Academic Projects Discovery"}
        </h2>
        <div className="h-px bg-gray-100 flex-1"></div>
        {currentUser && (
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
        )}
      </div>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {loading ? (
          <LoadingSpinner message="Loading research discovery feed..." />
        ) : feedData.length > 0 ? (
          feedData.map((post) => (
            <FeedItem
              key={post.id}
              post={post}
              currentUser={currentUser}
              onProfileClick={openProfile}
              onProjectClick={openProject}
            />
          ))
        ) : (
          <div className="text-center py-20 text-gray-400 font-medium">
            No research updates found.
          </div>
        )}
      </div>
      <UserProfileModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        universityID={selectedUserID}
      />
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projectID={selectedProjectID}
      />
    </div>
  );
};

export default Feed;
