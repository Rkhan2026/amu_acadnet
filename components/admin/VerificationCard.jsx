import React from "react";
import {
  CheckCircle2,
  XCircle,
  User,
  Building2,
  Clock,
  ShieldCheck,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import StatusBadge from "@/components/ui/StatusBadge";

const VerificationCard = ({ request, onAction, onClick, isSubmitting }) => (
  <div
    onClick={() => !isSubmitting && onClick(request)}
    className={`bg-white p-8 rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in slide-in-from-right-4 duration-500 hover:border-amu-green/30 transition-all cursor-pointer group ${isSubmitting ? "opacity-70 pointer-events-none" : ""}`}
  >
    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
      <div className="flex gap-6 items-center">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl group-hover:bg-amu-green/5 transition-all flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
          {request.avatar && request.avatar !== "/default-avatar.svg" ? (
            <Image
              src={request.avatar}
              alt={request.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-8 w-8 text-gray-400 group-hover:text-amu-green transition-colors" />
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black text-gray-900">{request.name}</h3>
            <span className="px-3 py-1 bg-amu-gold/10 text-amu-gold text-[10px] font-black uppercase tracking-widest rounded-full border border-amu-gold/20">
              {request.role}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-500 font-medium text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {request.department}
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              ID: {request.universityId}
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="h-4 w-4" />
              {request.appliedAt}
            </div>
            {request.accountStatus !== "PENDING" && (
              <StatusBadge status={request.accountStatus} />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto">
        <a
          href={request.identityProof}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center gap-2 p-3 px-6 bg-amu-gold/5 border border-amu-gold/20 rounded-2xl hover:bg-amu-gold/10 transition-all cursor-pointer group/proof min-w-[140px]"
        >
          <div className="flex items-center gap-2 text-amu-gold">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Identity Proof
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 group-hover/proof:text-amu-gold transition-colors">
            <ExternalLink className="h-4 w-4" />
            <span className="text-xs font-bold">View Document</span>
          </div>
        </a>

        <div className="flex items-center gap-3">
          {request.accountStatus !== "APPROVED" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction(request.id, "approve");
              }}
              disabled={isSubmitting}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-amu-green text-white font-bold rounded-2xl hover:bg-amu-green/90 transition-all shadow-lg shadow-amu-green/20 disabled:opacity-70 min-w-[140px] whitespace-nowrap"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
              Verify
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction(request.id, "reject");
            }}
            disabled={isSubmitting}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-70 min-w-[140px] whitespace-nowrap"
          >
            <XCircle className="h-5 w-5" />
            {request.accountStatus === "REJECTED" ? "Edit Reason" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default VerificationCard;
