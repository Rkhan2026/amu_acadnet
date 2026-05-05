import React, { memo } from "react";
import Image from "next/image";
import { Briefcase, Check, X, Clock, Loader2 } from "lucide-react";

const CollabRequestCard = memo(
  ({ request, type, onAction, onViewProfile, onViewProject, isProcessing }) => {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 group hover:border-amu-green/30 transition-all flex flex-col h-full">
        <div className="flex items-start gap-4 mb-6">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
            {request.avatar ? (
              <Image
                src={request.avatar}
                alt={request.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-amu-gold/5 text-amu-gold">
                <Briefcase className="h-6 w-6" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              onClick={() => onViewProject(request.projectId)}
              className="text-base font-black text-gray-900 group-hover:text-amu-green transition-colors line-clamp-2 cursor-pointer leading-tight mb-1"
            >
              {request.name}
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              {type === "received" ? (
                <>
                  From:{" "}
                  <span
                    onClick={() => onViewProfile(request.senderID)}
                    className="text-gray-600 hover:text-amu-green cursor-pointer transition-colors"
                  >
                    {request.from}
                  </span>
                </>
              ) : (
                <>
                  To:{" "}
                  <span
                    onClick={() => onViewProfile(request.receiverID)}
                    className="text-gray-600 hover:text-amu-green cursor-pointer transition-colors"
                  >
                    {request.to}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 p-3 bg-gray-50 rounded-2xl border border-gray-100">
          <Clock className="h-4 w-4 text-amu-gold" />
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            {request.isInvite ? "Invitation Pending" : "Request Pending"}
          </span>
        </div>

        <div className="flex gap-2">
          {type === "received" ? (
            <>
              <button
                onClick={() => onAction(request.id, "accept")}
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
                onClick={() => onAction(request.id, "reject")}
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
              onClick={() => onAction(request.id, "cancel")}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-red-50 hover:text-red-500 transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>Cancel {request.isInvite ? "Invitation" : "Request"}</>
              )}
            </button>
          )}
        </div>
      </div>
    );
  },
);

CollabRequestCard.displayName = "CollabRequestCard";
export default CollabRequestCard;
