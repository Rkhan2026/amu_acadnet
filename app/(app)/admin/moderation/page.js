"use client";
import React, { useState } from "react";
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  BookOpen,
  Calendar,
  User,
  Type,
} from "lucide-react";
import { PENDING_PUBLICATIONS } from "@/lib/dummyData";

const ModerationCard = ({ publication, onAction }) => (
  <div className="bg-white p-8 rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
      <div className="flex gap-6 items-start">
        <div className="p-4 bg-gray-50 rounded-2xl">
          <BookOpen className="h-8 w-8 text-amu-green" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-black text-gray-900 leading-tight">
            {publication.title}
          </h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-500 font-medium text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {publication.author}
            </div>
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              {publication.type}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {publication.year}
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              Submitted: {publication.submittedAt}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
        <button
          onClick={() => onAction(publication.id, "approve")}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-amu-green text-white font-bold rounded-2xl hover:bg-amu-green/90 transition-all shadow-lg shadow-amu-green/20"
        >
          <CheckCircle2 className="h-5 w-5" />
          Approve
        </button>
        <button
          onClick={() => onAction(publication.id, "reject")}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <XCircle className="h-5 w-5" />
          Reject
        </button>
      </div>
    </div>
  </div>
);

export default function ModerationPage() {
  const [publications, setPublications] = useState(PENDING_PUBLICATIONS);
  const handleAction = (id, _action) => {
    // In a real app, API call would happen here
    setPublications((prev) => prev.filter((req) => req.id !== id));
  };
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
          Publication Moderation
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Review and approve research publications for the institutional
          repository.
        </p>
      </div>

      <div className="space-y-6">
        {publications.length > 0 ? (
          publications.map((pub) => (
            <ModerationCard
              key={pub.id}
              publication={pub}
              onAction={handleAction}
            />
          ))
        ) : (
          <div className="bg-white p-20 rounded-4xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="p-6 bg-amu-green/10 rounded-3xl mb-6">
              <FileCheck size={48} className="text-amu-green" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              Moderation Complete
            </h3>
            <p className="text-gray-500 font-medium">
              All submitted research records have been reviewed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
