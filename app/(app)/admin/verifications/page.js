"use client";
import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  User,
  Building2,
  Clock,
} from "lucide-react";
import { PENDING_VERIFICATIONS } from "@/lib/dummyData";

const VerificationCard = ({ request, onAction }) => (
  <div className="bg-white p-8 rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
      <div className="flex gap-6 items-center">
        <div className="p-4 bg-gray-50 rounded-2xl">
          <User className="h-8 w-8 text-gray-400" />
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
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <button
          onClick={() => onAction(request.id, "approve")}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-amu-green text-white font-bold rounded-2xl hover:bg-amu-green/90 transition-all shadow-lg shadow-amu-green/20"
        >
          <CheckCircle2 className="h-5 w-5" />
          Verify
        </button>
        <button
          onClick={() => onAction(request.id, "reject")}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <XCircle className="h-5 w-5" />
          Reject
        </button>
      </div>
    </div>
  </div>
);

export default function VerificationsPage() {
  const [requests, setRequests] = useState(PENDING_VERIFICATIONS);

  const handleAction = (id, _action) => {
    // In a real app, API call would happen here
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
          Academic Verifications
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Verify institutional records and academic affiliations for members of
          AMU.
        </p>
      </div>

      <div className="space-y-6">
        {requests.length > 0 ? (
          requests.map((req) => (
            <VerificationCard
              key={req.id}
              request={req}
              onAction={handleAction}
            />
          ))
        ) : (
          <div className="bg-white p-20 rounded-4xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="p-6 bg-amu-green/10 rounded-3xl mb-6">
              <CheckCircle2 size={48} className="text-amu-green" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              Queue is Clear!
            </h3>
            <p className="text-gray-500 font-medium">
              All academic profiles have been successfully verified.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
