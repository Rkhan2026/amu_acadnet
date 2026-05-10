import React from "react";
import Link from "next/link";
import { Briefcase, Clock, CheckCircle2 } from "lucide-react";

const MyProjectCard = ({ project, onOpen }) => (
  <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-gray-200/40 border border-gray-100/50 hover:border-amu-green/30 transition-all group relative">
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-amu-green/5 rounded-2xl border border-amu-green/10">
          <Briefcase className="h-6 w-6 text-amu-green" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amu-green/10 text-amu-green">
              Project Domain: {project.domain}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                project.projectStatus === "Active" ||
                project.projectStatus === "On Hold" ||
                project.projectStatus === "Proposed"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amu-gold/10 text-amu-gold"
              }`}
            >
              {project.projectStatus}
            </span>
            {project.approvalStatus && (
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${
                  project.approvalStatus === "Approved"
                    ? "bg-emerald-100 text-emerald-700"
                    : project.approvalStatus === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                }`}
              >
                {project.approvalStatus === "Pending" && (
                  <Clock className="w-3 h-3" />
                )}
                {project.approvalStatus === "Approved" && (
                  <CheckCircle2 className="w-3 h-3" />
                )}
                {project.approvalStatus}
              </span>
            )}
          </div>
          <h3 className="text-xl font-black text-gray-900 group-hover:text-amu-green transition-colors leading-tight">
            {project.title}
          </h3>
        </div>
      </div>
    </div>

    <p className="text-gray-600 font-medium mb-8 line-clamp-2">
      {project.description}
    </p>

    <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-50">
      <div className="flex items-center gap-2 text-gray-400 font-medium text-sm">
        <Clock className="h-4 w-4" />
        <span>{project.time}</span>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => onOpen(project.id)}
          className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all flex items-center gap-2"
        >
          View Details
        </button>
        <Link
          href={`/projects/${project.id}`}
          target="_blank"
          className="px-5 py-2.5 bg-gray-100 text-gray-900 text-sm font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
        >
          Manage
        </Link>
      </div>
    </div>
  </div>
);

export default MyProjectCard;
