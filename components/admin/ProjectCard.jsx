import React from "react";
import {
  BookOpen,
  User,
  Type,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

const ProjectCard = ({ project, onAction, onClick, isSubmitting }) => (
  <div
    onClick={() => !isSubmitting && onClick(project)}
    className={`bg-white p-8 rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in slide-in-from-right-4 duration-500 hover:border-amu-green/30 transition-all group cursor-pointer ${isSubmitting ? "opacity-70 pointer-events-none" : ""}`}
  >
    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
      <div className="flex gap-6 items-center">
        <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-amu-green/5 transition-colors">
          <BookOpen className="h-8 w-8 text-gray-400 group-hover:text-amu-green transition-colors" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-black text-gray-900 leading-tight">
            {project.title}
          </h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-500 font-medium text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {project.author}
            </div>
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              {project.domain || project.type}
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="h-4 w-4" />
              {project.submittedAt}
            </div>
            {project.moderationStatus !== "PENDING" && (
              <StatusBadge status={project.moderationStatus} />
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        {project.moderationStatus !== "APPROVED" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction(project.id, "approve");
            }}
            disabled={isSubmitting}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-amu-green text-white font-bold rounded-2xl hover:bg-amu-green/90 transition-all shadow-lg shadow-amu-green/20 disabled:opacity-70 min-w-[140px] whitespace-nowrap"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <CheckCircle2 className="h-5 w-5" />
            )}
            Approve
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAction(project.id, "reject");
          }}
          disabled={isSubmitting}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-70 min-w-[140px] whitespace-nowrap"
        >
          <XCircle className="h-5 w-5" />
          {project.moderationStatus === "REJECTED" ? "Edit Reason" : "Reject"}
        </button>
      </div>
    </div>
  </div>
);

export default ProjectCard;
