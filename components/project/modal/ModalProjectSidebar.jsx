import React from "react";
import {
  Calendar,
  User,
  ChevronRight,
  CheckCircle2,
  UserPlus,
  UserMinus,
} from "lucide-react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";

const ModalProjectSidebar = ({
  project,
  currentUser,
  isAdmin,
  isOwner,
  requested,
  requestLoading,
  handleSendRequest,
  handleLeaveCollaboration,
  onProfileClick,
  formatStatus,
}) => {
  return (
    <div className="w-full lg:w-96 shrink-0 space-y-8">
      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
          Execution Status
        </h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-500 font-bold">
              <Calendar className="h-4 w-4" />
              <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                {project.submittedAt ? "Submitted At" : "Created At"}
              </span>
            </div>
            <span className="font-bold text-gray-900 text-sm text-right leading-tight">
              {new Date(
                project.submittedAt || project.createdAt,
              ).toLocaleString("en-US", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </span>
          </div>

          <div className="pt-8 border-t border-gray-50 space-y-8">
            {/* Project Creator Section */}
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">
                Project Creator
              </p>
              <button
                onClick={() => {
                  const creatorID =
                    project.universityID || project.creator?.universityID;
                  if (creatorID !== currentUser?.universityID) {
                    onProfileClick?.(creatorID);
                  }
                }}
                className={`w-full flex items-center justify-between group bg-amu-gold/5 p-4 rounded-3xl border border-amu-gold/10 transition-all text-left ${
                  project.universityID !== currentUser?.universityID ||
                  (project.creator?.universityID &&
                    project.creator.universityID !== currentUser?.universityID)
                    ? "hover:bg-amu-gold/10 cursor-pointer"
                    : "cursor-default opacity-80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={project.creator?.profilePhoto}
                    alt={project.creator?.name}
                    size="sm"
                    className="border-amu-gold/20"
                    fallbackIcon={User}
                  />
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-sm leading-tight group-hover:text-amu-gold transition-colors">
                      {project.creator?.name || project.author}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-amu-gold mt-0.5">
                      Owner
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amu-gold opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Team Members Section */}
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
                          if (mID !== currentUser?.universityID) {
                            onProfileClick?.(mID);
                          }
                        }}
                        className={`w-full flex items-center justify-between group p-2 rounded-2xl transition-all text-left ${
                          (member.universityID || member.id) !==
                          currentUser?.universityID
                            ? "hover:bg-gray-50 cursor-pointer"
                            : "cursor-default opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={member.profilePhoto || member.avatar}
                            alt={member.name}
                            size="sm"
                          />
                          <div className="text-left">
                            <p className="font-bold text-gray-900 text-sm leading-tight group-hover:text-amu-green transition-colors">
                              {member.name}
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">
                              {formatStatus(member.role) || "Researcher"}
                            </p>
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 ${
                            (member.universityID || member.id) ===
                            currentUser?.universityID
                              ? "hidden"
                              : ""
                          }`}
                        />
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
        </div>

        {currentUser && !isAdmin && project.status !== "COMPLETED" && (
          <div className="mt-10 pt-8 border-t border-gray-50">
            {isOwner ? (
              <Button
                as={Link}
                href={`/projects/${project.projectID}`}
                variant="dark"
                className="w-full"
              >
                Manage Full Project
              </Button>
            ) : (
              <div className="space-y-4">
                <Button
                  onClick={
                    requested === "ACCEPTED"
                      ? handleLeaveCollaboration
                      : requested
                        ? null
                        : handleSendRequest
                  }
                  disabled={requestLoading || requested === "PENDING"}
                  isLoading={requestLoading}
                  variant={
                    requested === "ACCEPTED"
                      ? "outline"
                      : requested === "PENDING"
                        ? "ghost"
                        : "primary"
                  }
                  className={`w-full group ${
                    requested === "ACCEPTED"
                      ? "hover:bg-red-50 hover:text-red-500 hover:border-red-100"
                      : ""
                  }`}
                >
                  {requested === "ACCEPTED" ? (
                    <>
                      <span className="group-hover:hidden flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Collaborating
                      </span>
                      <span className="hidden group-hover:flex items-center gap-2">
                        <UserMinus className="w-4 h-4" /> Leave Project
                      </span>
                    </>
                  ) : requested === "PENDING" ? (
                    "Requested"
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" /> Join Project
                    </>
                  )}
                </Button>
                <Button
                  as={Link}
                  href={`/projects/${project.projectID}`}
                  target="_blank"
                  variant="ghost"
                  className="w-full bg-gray-100"
                >
                  View Full Page
                </Button>
              </div>
            )}
          </div>
        )}
        {!currentUser && !isAdmin && (
          <div className="mt-10 pt-8 border-t border-gray-50">
            <Button
              as={Link}
              href="/login"
              variant="primary"
              className="w-full"
            >
              Login to Collaborate
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalProjectSidebar;
