import React, { memo } from "react";
import { Briefcase, UserMinus, Clock, CheckCircle2 } from "lucide-react";

const CollaborationCard = memo(
  ({ collab, onLeave, onViewProfile, onViewProject }) => {
    const displayTeam = collab.team.slice(0, 2);
    const hasMore = collab.team.length > 2;

    return (
      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-amu-green/30 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <Briefcase className="h-16 w-16 text-amu-green" />
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            {collab.status === "COMPLETED" ? (
              <CheckCircle2 className="h-4 w-4 text-amu-green" />
            ) : (
              <Clock className="h-4 w-4 text-amu-gold animate-pulse" />
            )}
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${collab.status === "COMPLETED" ? "text-amu-green" : "text-amu-gold"}`}
            >
              {collab.status}
            </span>
          </div>
          <h3
            onClick={() => onViewProject(collab.projectId)}
            className="text-lg font-black text-gray-900 group-hover:text-amu-green transition-colors cursor-pointer line-clamp-1"
          >
            {collab.name}
          </h3>
          <p className="text-xs font-bold text-gray-400 mt-1">
            Lead:{" "}
            <span
              onClick={() =>
                !collab.isCreatorMe && onViewProfile(collab.creatorID)
              }
              className={
                !collab.isCreatorMe
                  ? "hover:text-amu-green cursor-pointer hover:underline transition-colors text-gray-500"
                  : ""
              }
            >
              {collab.creator}
            </span>
          </p>
        </div>

        <div className="mb-6 space-y-3">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
            Team Members
          </p>
          <div className="flex flex-wrap gap-2">
            {displayTeam.map((member, i) => {
              const isMe = member.name.includes("(You)");
              return (
                <span
                  key={i}
                  onClick={() => !isMe && onViewProfile(member.universityID)}
                  className={`px-3 py-1 bg-gray-50 text-[10px] font-bold rounded-lg border border-gray-100 transition-all ${!isMe ? "text-gray-500 hover:text-amu-green hover:border-amu-green/30 cursor-pointer" : "text-gray-400"}`}
                >
                  {member.name}
                </span>
              );
            })}
            {hasMore && (
              <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-lg border border-gray-100 italic">
                +{collab.team.length - 2} more
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onViewProject(collab.projectId)}
            className="flex-1 py-3 bg-amu-green/5 text-amu-green font-bold rounded-xl hover:bg-amu-green hover:text-white transition-all text-sm"
          >
            Project Details
          </button>
          {!collab.isCreatorMe && (
            <button
              onClick={onLeave}
              className="px-4 py-3 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
              title="Leave Collaboration"
            >
              <UserMinus className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    );
  },
);

CollaborationCard.displayName = "CollaborationCard";
export default CollaborationCard;
