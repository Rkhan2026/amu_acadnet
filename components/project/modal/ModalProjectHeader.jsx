import React from "react";
import { ArrowLeft, Building2, Clock, CheckCircle2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";

const ModalProjectHeader = ({
  project,
  isAdmin,
  isOwner,
  onClose,
  onProfileClick,
  formatStatus,
}) => {
  return (
    <div>
      {/* Admin Back Button */}
      {isAdmin && (
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-400 hover:text-amu-green font-bold text-xs uppercase tracking-widest transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      )}

      {/* Rejection Alert */}
      {project.moderationStatus === "REJECTED" && isOwner && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-2xl shadow-sm mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-black text-red-800">
                Project Requires Updates
              </h2>
              <p className="text-red-600 mt-2 font-medium">
                Your project was rejected. Please review the feedback, and
                resubmit.
              </p>
              <div className="mt-4 p-4 bg-white rounded-xl border border-red-100 text-red-900 font-medium">
                <span className="text-xs font-bold uppercase tracking-widest text-red-400 block mb-1">
                  Admin Feedback:
                </span>
                {project.adminFeedback || "No specific feedback provided."}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Badge variant="gold">
          {formatStatus(project.projectDomain || project.domain)}
        </Badge>
        <Badge
          variant={
            project.projectStatus === "ACTIVE" ||
            project.projectStatus === "ON_HOLD" ||
            project.projectStatus === "PROPOSED"
              ? "primary"
              : "default"
          }
        >
          <span
            className={`w-2 h-2 rounded-full ${
              project.projectStatus === "ACTIVE" ||
              project.projectStatus === "ON_HOLD" ||
              project.projectStatus === "PROPOSED"
                ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse"
                : "bg-gray-300"
            }`}
          ></span>
          {formatStatus(project.projectStatus)}
        </Badge>
        {project.moderationStatus && (
          <Badge
            variant={
              project.moderationStatus === "APPROVED"
                ? "success"
                : project.moderationStatus === "REJECTED"
                  ? "error"
                  : "warning"
            }
            icon={
              project.moderationStatus === "APPROVED" ? CheckCircle2 : Clock
            }
          >
            {formatStatus(project.moderationStatus)}
          </Badge>
        )}
      </div>

      <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight mb-8">
        {project.title}
      </h1>

      <div className="flex flex-wrap items-center gap-8 py-4 border-y border-gray-200/60">
        <button
          onClick={() =>
            onProfileClick?.(
              project.universityID || project.creator?.universityID,
            )
          }
          className="flex items-center gap-3 group text-left"
        >
          <Avatar
            src={project.creator?.profilePhoto}
            alt={project.creator?.name}
            className="group-hover:border-amu-green group-hover:shadow-md transition-all"
          />
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              Project Creator
            </p>
            <p className="font-bold text-gray-900 group-hover:text-amu-green transition-colors">
              {project.creator?.name || project.author || "Unknown"}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
            <Building2 className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              Department
            </p>
            <p className="font-bold text-gray-900">
              {project.creator?.department ||
                project.department ||
                "University"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalProjectHeader;
