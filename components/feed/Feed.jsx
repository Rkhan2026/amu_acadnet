"use client";
import React, { useState } from "react";
import FeedItem from "./FeedItem";
import { Sparkles, Users, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import UserProfileModal from "@/components/profile/UserProfileModal";
import ProjectModal from "@/components/project/ProjectModal";
import { useFeedData } from "@/hooks/useFeedData";

const Feed = () => {
  const [activeTab, setActiveTab] = useState("for-you");
  const [sortOption, setSortOption] = useState("Recent");
  const [isSortOpen, setIsSortOpen] = useState(false);
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
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-amu-green/20 rounded-xl text-[10px] font-black text-amu-green uppercase tracking-widest hover:border-amu-green/40 transition-all shadow-sm group"
            >
              {sortOption}
              <ChevronDown
                className={`h-3 w-3 transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsSortOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden"
                  >
                    {["Recent", "Match Score"].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortOption(option);
                          setIsSortOpen(false);
                        }}
                        className={`w-full px-5 py-3 text-left text-[11px] font-black uppercase tracking-widest flex items-center justify-between transition-colors ${
                          sortOption === option
                            ? "bg-amu-green/5 text-amu-green"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {option}
                        {sortOption === option && <Check className="h-3 w-3" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20"
            >
              <LoadingSpinner message="Loading research discovery feed..." />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab + sortOption} // Unique key to trigger transition
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {feedData.length > 0 ? (
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <UserProfileModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        universityID={selectedUserID}
        onProfileClick={openProfile}
        zIndex="z-[600]"
      />
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projectID={selectedProjectID}
        onProfileClick={openProfile}
        zIndex="z-[400]"
      />
    </div>
  );
};

export default Feed;
