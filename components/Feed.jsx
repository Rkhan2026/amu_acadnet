"use client";
import React, { useState } from "react";
import FeedItem from "./FeedItem";
import { RESEARCH_PUBLICATIONS, FOLLOWING_FEED } from "@/lib/dummyData";
import { Sparkles, Users } from "lucide-react";

const Feed = () => {
  const [activeTab, setActiveTab] = useState("for-you"); // "for-you" or "following"

  const displayFeed =
    activeTab === "for-you" ? RESEARCH_PUBLICATIONS : FOLLOWING_FEED;

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
          <select className="bg-transparent text-[10px] font-black text-amu-green outline-none cursor-pointer uppercase tracking-widest border border-amu-green/20 px-2 py-1 rounded-lg">
            <option>Match Score</option>
            <option>Recent</option>
            <option>Trending</option>
          </select>
        </div>
      </div>

      {/* Publications / Content */}
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {displayFeed.map((post) => (
          <FeedItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
