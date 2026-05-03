import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Check, UserPlus } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const SuggestedCollaborators = ({
  loading,
  suggested,
  onFollow,
  onUnfollow,
  onProfileClick,
}) => (
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
        <div className="py-12">
          <LoadingSpinner size="sm" message="Searching..." />
        </div>
      ) : suggested.length > 0 ? (
        suggested.map((user, idx) => (
          <div
            key={idx}
            onClick={() => onProfileClick(user.universityID)}
            className="flex items-center justify-between group/user cursor-pointer hover:bg-gray-50/50 p-2 -m-2 rounded-2xl transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100 group-hover/user:border-amu-green transition-all shadow-sm bg-gray-50 flex-shrink-0">
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
                  {Array.isArray(user.interestsSkills)
                    ? user.interestsSkills.join(", ")
                    : user.interestsSkills}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (user.followingStatus) {
                  onUnfollow(user.universityID, e);
                } else {
                  onFollow(user.universityID, e);
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
);

export default SuggestedCollaborators;
