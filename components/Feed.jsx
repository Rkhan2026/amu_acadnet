"use client";
import React from "react";
import FeedItem from "./FeedItem";
import { RESEARCH_PUBLICATIONS } from "@/lib/dummyData";

const Feed = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Feed Divider */}
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          AI Curated Research
        </h2>
        <div className="h-px bg-gray-100 flex-1"></div>
        <select className="bg-transparent text-sm font-black text-amu-green outline-none cursor-pointer uppercase tracking-widest">
          <option>Best Match</option>
          <option>Recent</option>
        </select>
      </div>

      {/* Publications */}
      <div className="space-y-8">
        {RESEARCH_PUBLICATIONS.map((pub) => (
          <FeedItem key={pub.id} post={pub} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
