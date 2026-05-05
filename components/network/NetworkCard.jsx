import React, { memo } from "react";
import Image from "next/image";
import { UserMinus, Loader2 } from "lucide-react";

const NetworkCard = memo(
  ({ user, type, onAction, onViewProfile, isProcessing }) => {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-amu-green/30 transition-all group">
        <div className="flex justify-between items-start mb-4">
          <div className="relative h-16 w-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-gray-50">
            <Image
              src={user.avatar}
              alt={user.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="mb-6">
          <h3
            className="text-lg font-black text-gray-900 group-hover:text-amu-green transition-colors cursor-pointer hover:underline"
            onClick={() => onViewProfile(user.universityID || user.id)}
          >
            {user.name}
          </h3>
          <p className="text-xs font-semibold text-gray-500">
            {user.department}
          </p>
        </div>

        <div className="mb-6 h-4" />

        <div className="flex gap-2">
          <button
            onClick={() => onViewProfile(user.universityID || user.id)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-amu-green/5 text-amu-green font-bold rounded-xl hover:bg-amu-green hover:text-white transition-all"
          >
            View Profile
          </button>
          {type === "following" && (
            <button
              onClick={() => onAction(user.universityID)}
              disabled={isProcessing}
              className="px-4 py-3 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Unfollow"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <UserMinus className="h-5 w-5" />
              )}
            </button>
          )}
          {type === "follower" && (
            <button
              onClick={() => onAction(user.universityID)}
              disabled={isProcessing}
              className="px-4 py-3 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Remove Follower"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <UserMinus className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  },
);

NetworkCard.displayName = "NetworkCard";
export default NetworkCard;
