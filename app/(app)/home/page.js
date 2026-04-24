"use client";
import React, { useState, useEffect } from "react";
import Feed from "@/components/Feed";
import { UserPlus, Sparkles, Check } from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import UserProfileModal from "@/components/UserProfileModal";

export default function HomePage() {
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFollow = async (tid, e) => {
    e.stopPropagation();
    try {
      const res = await fetch("/api/network/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetID: tid }),
      });
      if (res.ok) {
        setSuggested((prev) =>
          prev.map((u) =>
            u.universityID === tid ? { ...u, followingStatus: "PENDING" } : u,
          ),
        );
      }
    } catch (_e) {
      console.error("Follow error:", _e);
    }
  };

  const handleUnfollow = async (tid, e) => {
    e.stopPropagation();
    try {
      const res = await fetch("/api/network/follow", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetID: tid }),
      });
      if (res.ok) {
        setSuggested((prev) =>
          prev.map((u) =>
            u.universityID === tid ? { ...u, followingStatus: null } : u,
          ),
        );
      }
    } catch (_e) {
      console.error("Unfollow error:", _e);
    }
  };

  const openProfile = (uid) => {
    setSelectedUserID(uid);
    setIsModalOpen(true);
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/recommendations/collaborators").then((res) => res.json()),
      fetch("/api/network").then((res) => res.json()),
    ])
      .then(([recsData, networkData]) => {
        if (
          recsData.recommendations &&
          Array.isArray(recsData.recommendations)
        ) {
          const followMap = {};
          if (networkData.following) {
            networkData.following.forEach((f) => {
              followMap[f.followingID] = f.requestStatus;
            });
          }

          setSuggested(
            recsData.recommendations.map((rec) => ({
              name: rec.user.name,
              role: rec.user.role,
              avatar: "/default-avatar.svg",
              universityID: rec.user.universityID,
              researchInterests: rec.user.researchInterests,
              score: Math.round(rec.score * 100),
              followingStatus: followMap[rec.user.universityID] || null,
            })),
          );
        }
      })
      .catch((_e) => console.error(_e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Feed */}
      <div className="lg:col-span-2">
        <Feed />
      </div>

      {/* Right Sidebar (Suggestions) */}
      <div className="hidden lg:block py-8 pr-8 space-y-8">
        {/* AI Collaboration Recommendations */}
        <div className="bg-white rounded-4xl p-8 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles className="h-12 w-12 text-amu-gold" />
          </div>

          <h3 className="font-black text-gray-900 mb-6 flex items-center gap-3 text-lg tracking-tight">
            <div className="p-2 bg-amu-gold/10 rounded-xl">
              <Sparkles className="h-5 w-5 text-amu-gold" />
            </div>
            AI Collaboration
          </h3>

          <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">
            Recommended for you
          </p>

          <div className="space-y-6">
            {loading ? (
              <div className="text-gray-400 text-sm font-medium animate-pulse">
                Loading researchers...
              </div>
            ) : suggested.length > 0 ? (
              suggested.map((user, idx) => (
                <div
                  key={idx}
                  onClick={() => openProfile(user.universityID)}
                  className="flex items-center justify-between group/user cursor-pointer hover:bg-gray-50/50 p-2 -m-2 rounded-2xl transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-gray-50 group-hover/user:border-amu-green transition-all shadow-sm">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-black text-base text-gray-900 leading-tight">
                        {user.name}
                      </h4>
                      <p className="text-sm font-black text-amu-green uppercase tracking-wide mt-1">
                        {user.role} - {user.score}% Match
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                        {user.researchInterests}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (user.followingStatus) {
                        handleUnfollow(user.universityID, e);
                      } else {
                        handleFollow(user.universityID, e);
                      }
                    }}
                    className={`p-2.5 rounded-2xl transition-all shadow-inner ${
                      user.followingStatus
                        ? "bg-amu-green text-white"
                        : "bg-gray-50 hover:bg-amu-green hover:text-white text-gray-400"
                    }`}
                  >
                    {user.followingStatus ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <UserPlus className="h-5 w-5" />
                    )}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-xs italic">
                No suggestions available.
              </p>
            )}
          </div>
          <Link
            href="/explore?tab=researchers"
            className="block w-full mt-8 py-4 bg-gray-50 hover:bg-amu-green/5 text-sm font-black rounded-2xl transition-all uppercase tracking-widest border border-transparent hover:border-amu-green/20 text-center text-amu-green"
          >
            View All Researchers
          </Link>
        </div>
      </div>

      <UserProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        universityID={selectedUserID}
      />
    </div>
  );
}
