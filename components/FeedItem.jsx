"use client";
import React from "react";
import { MoreHorizontal, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const FeedItem = ({ post }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100 mb-8 transition-all hover:border-amu-green/30 relative overflow-hidden group"
    >
      {/* Header with ellipsis only */}
      <div className="flex justify-end mb-6">
        <button className="text-gray-300 hover:text-gray-900 transition-colors">
          <MoreHorizontal className="h-6 w-6" />
        </button>
      </div>

      {/* Project Content */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="px-5 py-2 bg-amu-green/10 text-amu-green text-[12px] font-black uppercase tracking-widest rounded-xl border border-amu-green/20 shadow-sm">
              {post.domain}
            </span>
            <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2.5">
              <span
                className={`w-3 h-3 rounded-full ${
                  post.projectStatus === "Active" ||
                  post.projectStatus === "Ongoing"
                    ? "bg-amu-green shadow-[0_0_8px_rgba(4,103,66,0.4)] animate-pulse"
                    : "bg-amu-gold"
                }`}
              ></span>
              {post.projectStatus}
            </span>
          </div>
          <h3 className="text-2xl font-black text-gray-900 leading-[1.15] mb-4 group-hover:text-amu-green transition-colors cursor-pointer">
            {post.title}
          </h3>
          <div className="flex items-center gap-4 text-sm font-bold text-gray-500 mb-2">
            <span className="text-gray-900">{post.leadResearcher}</span>
          </div>
        </div>

        <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 relative quote-block">
          <p className="text-gray-600 leading-relaxed font-medium relative z-10">
            {post.description}
          </p>
        </div>

      </div>

      {/* Footer - Restored Actions */}
      <div className="flex items-center justify-between mt-10 pt-8 border-t border-gray-50 gap-4">
        <Link 
          href={`/projects/${post.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-amu-green text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:shadow-amu-green/40 hover:-translate-y-1 transition-all"
        >
          <BookOpen className="h-4 w-4" />
          Full Project
        </Link>
        <button className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white text-amu-green border-2 border-amu-green rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-amu-green/5 hover:-translate-y-1 transition-all">
          Accept Collab Request
        </button>
      </div>
    </motion.div>
  );
};

export default FeedItem;
