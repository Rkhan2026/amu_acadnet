import React, { memo } from "react";
import {
  Calendar,
  User,
  Trash2,
  Save,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const ProjectSidebar = memo(
  ({
    project,
    isEditing,
    isOwner,
    isSaving,
    onSave,
    onCancel,
    onDelete,
    requested,
    requestLoading,
    onSendRequest,
    onLeaveCollaboration,
    onProfileClick,
  }) => {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100"
        >
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">
            Execution Status
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-gray-500 font-bold">
                <Calendar className="h-4 w-4" />
                <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                  Created At
                </span>
              </div>
              <span className="font-bold text-gray-900 text-xs text-right leading-tight max-w-[140px]">
                {project.time || "2d ago"}
              </span>
            </div>
          </div>

          {/* Project Team Section */}
          <div className="mt-10 pt-8 border-t border-gray-50">
            <div className="space-y-8">
              {/* Lead Researcher Section */}
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">
                  Project Creator
                </p>
                <button
                  onClick={() => {
                    const creatorID =
                      project.universityID || project.creator?.universityID;
                    if (creatorID) onProfileClick?.(creatorID);
                  }}
                  className="w-full flex items-center justify-between group bg-amu-gold/5 p-4 rounded-3xl border border-amu-gold/10 hover:bg-amu-gold/10 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amu-gold/10 border border-amu-gold/20 flex items-center justify-center overflow-hidden">
                      {project.creator?.profilePhoto ? (
                        <Image
                          src={project.creator.profilePhoto}
                          alt={project.creator.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <User className="h-5 w-5 text-amu-gold" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 text-sm leading-tight group-hover:text-amu-gold transition-colors">
                        {project.creator?.name || project.author}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-amu-gold mt-0.5">
                        Project Creator
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Collaborators Section */}
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">
                  Team Members
                </p>
                <div className="space-y-4">
                  {(() => {
                    const collaborators =
                      project.collaborations
                        ?.filter((c) => c.requestStatus === "ACCEPTED")
                        .map((c) => c.sender) || [];

                    const directMembers = project.teamMembers || [];

                    const allMembers = [
                      ...collaborators,
                      ...directMembers,
                    ].filter((m, index, self) => {
                      const mID = m.universityID || m.id;
                      const projectOwnerID =
                        project.universityID || project.creator?.universityID;
                      if (!mID) return false;
                      if (mID === projectOwnerID) return false;
                      return (
                        self.findIndex(
                          (t) => (t.universityID || t.id) === mID,
                        ) === index
                      );
                    });

                    if (allMembers.length > 0) {
                      return allMembers.map((member, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            const mID = member.universityID || member.id;
                            if (mID) onProfileClick?.(mID);
                          }}
                          className="w-full flex items-center justify-between group p-3 hover:bg-gray-50 rounded-2xl transition-all text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex-shrink-0">
                              <Image
                                src={
                                  member.profilePhoto ||
                                  member.avatar ||
                                  "/default-avatar.svg"
                                }
                                alt={member.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-gray-900 text-sm leading-tight group-hover:text-amu-green transition-colors">
                                {member.name}
                              </p>
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">
                                {member.role || "Researcher"}
                              </p>
                            </div>
                          </div>
                          {isEditing && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                              title="Remove Team Member"
                            >
                              <Trash2 className="h-4 w-4" />
                            </div>
                          )}
                        </button>
                      ));
                    }

                    return (
                      <div className="p-6 text-center bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl">
                        <p className="text-[10px] text-gray-400 font-bold italic uppercase tracking-widest">
                          No additional team members
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-3">
              {isOwner ? (
                <div className="space-y-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={onSave}
                        disabled={isSaving}
                        className={`w-full py-4 bg-amu-green text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-amu-green/20 hover:shadow-amu-green/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 ${isSaving ? "opacity-70 cursor-not-allowed" : ""}`}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Saving
                            Changes...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" /> Save Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={onCancel}
                        className="w-full py-4 bg-white text-gray-900 border border-gray-200 rounded-2xl font-black uppercase tracking-widest text-sm hover:border-gray-900 transition-all flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onSave()} // Using as toggle
                        className="w-full py-4 bg-amu-green text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-amu-green/20 hover:shadow-amu-green/40 hover:-translate-y-1 transition-all"
                      >
                        Edit Project Details
                      </button>
                      <button
                        onClick={onDelete}
                        className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Project
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {requested === "ACCEPTED" ? (
                    <div className="space-y-3">
                      <div className="w-full py-4 bg-amu-green/5 text-amu-green border border-amu-green/20 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> You are a
                        Collaborator
                      </div>
                      <button
                        onClick={onLeaveCollaboration}
                        disabled={requestLoading}
                        className="w-full py-4 bg-red-50 text-red-400 hover:text-red-500 hover:bg-red-100 rounded-2xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50"
                      >
                        {requestLoading
                          ? "Processing..."
                          : "Leave Collaboration"}
                      </button>
                    </div>
                  ) : requested === "PENDING" ? (
                    <button
                      onClick={onLeaveCollaboration}
                      disabled={requestLoading}
                      className="w-full py-4 bg-amu-gold/5 text-amu-gold border border-amu-gold/20 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all group disabled:opacity-50"
                    >
                      <AlertCircle className="h-4 w-4 group-hover:hidden" />
                      <span className="group-hover:hidden">
                        Request Pending
                      </span>
                      <span className="hidden group-hover:inline">
                        {requestLoading ? "Cancelling..." : "Cancel Request"}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={onSendRequest}
                      disabled={requestLoading}
                      className="w-full py-4 bg-amu-green text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-amu-green/20 hover:shadow-amu-green/40 hover:-translate-y-1 transition-all disabled:opacity-50"
                    >
                      {requestLoading
                        ? "Sending Request..."
                        : "Request to Collaborate"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  },
);

ProjectSidebar.displayName = "ProjectSidebar";
export default ProjectSidebar;
