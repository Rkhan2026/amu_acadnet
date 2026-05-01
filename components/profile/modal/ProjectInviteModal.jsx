import React, { useState, useEffect } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { Loader2, Briefcase, Plus, Check, MessageSquare } from "lucide-react";

const ProjectInviteModal = ({ isOpen, onClose, targetUser }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invitingID, setInvitingID] = useState(null);
  const [successID, setSuccessID] = useState(null);

  useEffect(() => {
    if (isOpen && targetUser?.universityID) {
      setLoading(true);
      const targetID = targetUser.universityID;

      Promise.all([
        fetch("/api/auth/me").then((r) => r.json()),
        fetch("/api/projects").then((r) => r.json()),
        fetch("/api/network").then((r) => r.json()),
      ])
        .then(([authData, projectData, networkData]) => {
          if (!authData.error && !projectData.error && !networkData.error) {
            const myID = authData.user?.universityID;

            const myOwnedProjects = projectData.filter(
              (p) => p.universityID === myID,
            );

            const projectsWithStatus = myOwnedProjects.map((p) => {
              const sentInvite = (networkData.sentCollaborations || []).find(
                (c) =>
                  (c.projectID || c.project?.projectID) === p.projectID &&
                  (c.receiverID || c.receiver?.universityID) === targetID,
              );
              const receivedApp = (
                networkData.receivedCollaborations || []
              ).find(
                (c) =>
                  (c.projectID || c.project?.projectID) === p.projectID &&
                  (c.senderID || c.sender?.universityID) === targetID,
              );

              let status = null;
              let type = null; // 'INVITE' or 'APPLICATION'

              if (sentInvite) {
                status = sentInvite.requestStatus;
                type = "INVITE";
              } else if (receivedApp) {
                status = receivedApp.requestStatus;
                type = "APPLICATION";
              }

              return {
                ...p,
                existingStatus: status,
                collabType: type,
              };
            });

            setProjects(projectsWithStatus);
          }
        })
        .catch((err) => console.error("Invite modal data fetch error:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, targetUser?.universityID]);

  const handleInvite = async (projectID) => {
    if (!targetUser?.universityID) return;
    setInvitingID(projectID);

    try {
      const res = await fetch("/api/network/collaboration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectID,
          receiverID: targetUser.universityID,
        }),
      });

      if (res.ok) {
        setSuccessID(projectID);
        setProjects((prev) =>
          prev.map((p) =>
            p.projectID === projectID
              ? { ...p, existingStatus: "PENDING", collabType: "INVITE" }
              : p,
          ),
        );
        setTimeout(() => setSuccessID(null), 3000);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Invite request error:", error);
    } finally {
      setInvitingID(null);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} zIndex="z-[600]">
      <div className="p-10 bg-white">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            Invite to Project
          </h2>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">
            Select a project to invite{" "}
            <span className="text-amu-green font-black">
              {targetUser?.name}
            </span>{" "}
            to collaborate.
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 text-amu-green animate-spin mb-4" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Fetching projects...
            </p>
          </div>
        ) : projects.length > 0 ? (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {projects.map((project) => {
              const isPendingInvite =
                project.existingStatus === "PENDING" &&
                project.collabType === "INVITE";
              const isPendingApp =
                project.existingStatus === "PENDING" &&
                project.collabType === "APPLICATION";
              const isAccepted = project.existingStatus === "ACCEPTED";
              const isInviting = invitingID === project.projectID;
              const hasSuccess = successID === project.projectID;

              return (
                <div
                  key={project.projectID}
                  className="group flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-amu-green/30 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-amu-green group-hover:bg-amu-green group-hover:text-white transition-colors">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-gray-900 group-hover:text-amu-green transition-colors line-clamp-1">
                        {project.title}
                      </h4>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                        {project.projectDomain}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant={
                      hasSuccess ||
                      isPendingInvite ||
                      isPendingApp ||
                      isAccepted
                        ? "primary"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => handleInvite(project.projectID)}
                    disabled={
                      isInviting ||
                      hasSuccess ||
                      isPendingInvite ||
                      isPendingApp ||
                      isAccepted
                    }
                    className="rounded-xl min-w-[120px]"
                  >
                    {isInviting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : hasSuccess || isPendingInvite ? (
                      <>
                        <Check className="h-4 w-4" /> Invite Sent
                      </>
                    ) : isPendingApp ? (
                      <>
                        <MessageSquare className="h-4 w-4" /> Received Request
                        Pending
                      </>
                    ) : isAccepted ? (
                      <>
                        <Check className="h-4 w-4" /> Member
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" /> Invite
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-black text-xs uppercase tracking-widest">
              You haven&apos;t created any projects yet.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-6 mx-auto"
              onClick={() => (window.location.href = "/projects/create")}
            >
              Create Project
            </Button>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-gray-50 flex justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            className="font-black text-[10px] tracking-widest uppercase"
          >
            Cancel
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ProjectInviteModal;
