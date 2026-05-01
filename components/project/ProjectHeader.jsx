import React from "react";
import { User, Building2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import DomainSelect from "@/components/ui/DomainSelect";

const ProjectHeader = React.memo(
  ({ project, isEditing, editForm, setEditForm, isOwner, onProfileClick }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {project.moderationStatus === "REJECTED" && isOwner && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-2xl shadow-sm mb-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-black text-red-800">
                  Project Requires Updates
                </h2>
                <p className="text-red-600 mt-2 font-medium">
                  Your project was rejected. Please review the feedback, edit
                  your details, and resubmit.
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

        <div
          className={`flex flex-wrap items-start gap-4 ${isEditing ? "mb-6" : ""}`}
        >
          {isEditing ? (
            <div className="flex flex-col gap-3 min-w-[280px]">
              <DomainSelect
                value={editForm.domain}
                onChange={(val) => setEditForm({ ...editForm, domain: val })}
                className="!space-y-0"
              />
            </div>
          ) : (
            <span className="px-6 py-2.5 bg-amu-green/10 text-amu-green text-sm font-black uppercase tracking-widest rounded-2xl border border-amu-green/20 shadow-sm">
              {project.domain}
            </span>
          )}
          {isEditing ? (
            <select
              value={editForm.projectStatus}
              onChange={(e) =>
                setEditForm({ ...editForm, projectStatus: e.target.value })
              }
              className="px-6 py-2.5 text-sm font-black uppercase tracking-widest rounded-2xl border-2 border-amu-green focus:outline-none focus:ring-4 focus:ring-amu-green/20 bg-white text-amu-green appearance-none cursor-pointer"
            >
              <option value="Proposed">Proposed</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Archived">Archived</option>
            </select>
          ) : (
            <span
              className={`px-6 py-2.5 text-sm font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 border shadow-sm ${
                project.projectStatus === "Active" ||
                project.projectStatus === "On Hold" ||
                project.projectStatus === "Proposed"
                  ? "bg-amu-green text-white border-amu-green"
                  : "bg-gray-50 text-gray-400 border-gray-100"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  project.projectStatus === "Active" ||
                  project.projectStatus === "On Hold" ||
                  project.projectStatus === "Proposed"
                    ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse"
                    : "bg-gray-300"
                }`}
              ></span>
              {project.projectStatus}
            </span>
          )}
        </div>

        {isEditing ? (
          <input
            type="text"
            value={editForm.title}
            onChange={(e) =>
              setEditForm({ ...editForm, title: e.target.value })
            }
            className="w-full text-5xl font-black text-gray-900 leading-[1.1] tracking-tight bg-white border-2 border-gray-200 rounded-2xl p-4 focus:outline-none focus:border-amu-green focus:ring-4 focus:ring-amu-green/20"
          />
        ) : (
          <h1 className="text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
            {project.title}
          </h1>
        )}

        <div className="flex flex-wrap items-center gap-8 py-4 border-y border-gray-50">
          <button
            onClick={() => {
              const creatorID =
                project.universityID || project.creator?.universityID;
              if (creatorID) onProfileClick?.(creatorID);
            }}
            className="flex items-center gap-3 hover:bg-gray-50 p-2 -m-2 rounded-2xl transition-all text-left"
          >
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden">
              {project.creator?.profilePhoto ? (
                <Image
                  src={project.creator.profilePhoto}
                  alt={project.creator.name}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              ) : (
                <User className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                Project Creator
              </p>
              <p className="font-bold text-gray-900 group-hover:text-amu-green transition-colors">
                {project.creator?.name || project.author}
              </p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
              <Building2 className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                Department
              </p>
              <p className="font-bold text-gray-900">{project.department}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  },
);

ProjectHeader.displayName = "ProjectHeader";
export default ProjectHeader;
