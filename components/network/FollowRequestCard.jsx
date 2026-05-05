import React, { memo } from "react";
import Image from "next/image";
import { Check, X, Clock, Loader2 } from "lucide-react";
const FollowRequestCard = memo(
  ({ request, type, onAction, onViewProfile, isProcessing }) => {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 group">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative h-14 w-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            <Image
              src={request.avatar}
              alt={request.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              onClick={() => onViewProfile(request.universityID)}
              className="text-base font-black text-gray-900 group-hover:text-amu-green transition-colors truncate cursor-pointer"
            >
              {request.name}
            </h3>
            <p className="text-xs font-bold text-gray-400 truncate">
              {request.department}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 p-3 bg-gray-50 rounded-2xl border border-gray-100">
          <Clock className="h-4 w-4 text-amu-gold" />
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            {type === "sent" ? "Request Pending" : "Wants to follow you"}
          </span>
        </div>

        <div className="flex gap-2">
          {type === "received" ? (
            <>
              <button
                onClick={() => onAction(request.id, "accept", "received")}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-amu-green text-white font-bold rounded-xl hover:shadow-lg hover:shadow-amu-green/20 transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Accept
                  </>
                )}
              </button>
              <button
                onClick={() => onAction(request.id, "reject", "received")}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-red-50 hover:text-red-500 transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <X className="h-4 w-4" /> Reject
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => onAction(request.universityID, "cancel", "sent")}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-red-50 hover:text-red-500 transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Cancel Request"
              )}
            </button>
          )}
        </div>
      </div>
    );
  },
);

FollowRequestCard.displayName = "FollowRequestCard";
export default FollowRequestCard;
