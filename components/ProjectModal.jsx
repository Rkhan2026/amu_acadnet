"use client";
import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Calendar,
  User,
  ExternalLink,
  Building2,
  CheckCircle2,
  Clock,
  UserPlus,
  UserMinus,
  ChevronRight,
  ArrowLeft,
  ListChecks,
} from "lucide-react";
import { motion } from "framer-motion";

import Link from "next/link";
import LoadingSpinner from "./LoadingSpinner";
import BaseModal from "./ui/BaseModal";
import Badge from "./ui/Badge";
import Avatar from "./ui/Avatar";
import Section from "./ui/Section";
import Button from "./ui/Button";

const ProjectModal = ({
  isOpen,
  onClose,
  projectID,
  project: initialProject,
  onProfileClick,
  isAdmin: isAdminProp,
  zIndex,
}) => {
  const [project, setProject] = useState(initialProject || null);
  const [loading, setLoading] = useState(!initialProject);
  const [currentUser, setCurrentUser] = useState(null);
  const [requested, setRequested] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [collaborationID, setCollaborationID] = useState(null);
  const [prevID, setPrevID] = useState(null);

  // Synchronize state with props
  const currentProjectID =
    projectID || initialProject?.projectID || initialProject?.id;
  if (currentProjectID !== prevID) {
    setPrevID(currentProjectID);
    setProject(initialProject || null);
    setLoading(!initialProject && !!currentProjectID);
    setRequested(null);
    setCollaborationID(null);
  }

  useEffect(() => {
    if (isOpen && currentProjectID) {
      const fetchData = async () => {
        // If we don't have project data yet, show loading
        if (!project && !initialProject) setLoading(true);

        try {
          // Fetch current user separately so it doesn't block project data
          fetch("/api/auth/me")
            .then((r) => r.json())
            .then((res) => {
              if (res && res.user) setCurrentUser(res.user);
            })
            .catch(() => {});

          let activeProject = project || initialProject;

          // Always fetch full details if we only have a partial project object
          // or if we were passed a projectID string.
          if (
            !activeProject ||
            (!activeProject.requirements && currentProjectID)
          ) {
            const projRes = await fetch(
              `/api/projects/${currentProjectID}`,
            ).then((r) => r.json());
            if (!projRes.error) {
              setProject(projRes);
              activeProject = projRes;
            }
          }

          // Fetch collaboration status only if not an admin and we have a project
          const isAdmin = isAdminProp || currentUser?.role === "ADMIN";
          if (activeProject && !isAdmin) {
            fetch("/api/network")
              .then((r) => r.json())
              .then((netRes) => {
                if (!netRes.error) {
                  const pid = activeProject.projectID;
                  const sent = netRes.sentCollaborations?.find(
                    (c) => c.projectID === pid,
                  );
                  const received = netRes.receivedCollaborations?.find(
                    (c) => c.projectID === pid,
                  );
                  const collab = sent || received;
                  if (collab) {
                    setRequested(collab.requestStatus);
                    setCollaborationID(collab.requestID);
                  }
                }
              })
              .catch(() => {});
          }
        } catch (err) {
          console.error("Error fetching project data:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentProjectID]);

  const handleSendRequest = async () => {
    setRequestLoading(true);
    try {
      const res = await fetch("/api/network/collaboration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectID: project.projectID,
          receiverID: project.universityID,
        }),
      });
      if (res.ok) {
        setRequested("PENDING");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to send request");
      }
    } catch (_e) {
      alert("Something went wrong");
    } finally {
      setRequestLoading(false);
    }
  };

  const handleLeaveCollaboration = async () => {
    if (
      !confirm("Are you sure you want to stop collaborating on this project?")
    )
      return;

    setRequestLoading(true);
    try {
      const res = await fetch("/api/network/collaboration", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestID: collaborationID }),
      });
      if (res.ok) {
        setRequested(null);
        setCollaborationID(null);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to leave collaboration");
      }
    } catch (_e) {
      alert("Something went wrong");
    } finally {
      setRequestLoading(false);
    }
  };

  const isAdmin = isAdminProp || currentUser?.role === "ADMIN";
  const isOwner =
    currentUser && project?.universityID === currentUser.universityID;

  const formatStatus = (s) => s?.replace(/_/g, " ");

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} zIndex={zIndex}>
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-20">
          <LoadingSpinner message="Loading Project Details..." />
        </div>
      ) : project ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto custom-scrollbar"
        >
          <div className="p-8 md:p-12">
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
                      {project.adminFeedback ||
                        "No specific feedback provided."}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-12">
              {/* Main Content */}
              <div className="flex-1 space-y-10">
                <div>
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
                    {project.moderationStatus &&
                      project.moderationStatus !== "APPROVED" && (
                        <Badge
                          variant={
                            project.moderationStatus === "REJECTED"
                              ? "error"
                              : "warning"
                          }
                          icon={Clock}
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

                {/* Description */}
                <Section title="Description" icon={BookOpen}>
                  <p className="text-gray-600 font-medium leading-relaxed prose prose-lg max-w-none">
                    {project.description || "No description provided."}
                  </p>
                </Section>

                {/* Technical Requirements */}
                {project.requirements && project.requirements.length > 0 && (
                  <Section title="Technical Requirements" icon={ListChecks}>
                    <div className="flex flex-wrap gap-3">
                      {project.requirements.map((req, i) => (
                        <Badge
                          key={i}
                          className="px-5 py-2.5 text-sm font-bold lowercase cursor-default"
                        >
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </Section>
                )}

                {/* External Links */}
                <Section
                  title="External Links"
                  icon={ExternalLink}
                  variant="gray"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.externalLinks &&
                    project.externalLinks.length > 0 ? (
                      project.externalLinks.map((link, i) => (
                        <a
                          key={i}
                          href={
                            typeof link === "string" ? link : link.url || "#"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center justify-center group hover:border-amu-green transition-all shadow-sm overflow-hidden"
                        >
                          <p className="text-gray-500 group-hover:text-amu-green transition-colors truncate text-sm font-medium">
                            {typeof link === "string" ? link : link.url}
                          </p>
                        </a>
                      ))
                    ) : (
                      <div className="col-span-full py-8 text-center bg-white/50 border border-dashed border-gray-200 rounded-2xl">
                        <p className="text-sm text-gray-400 font-bold italic">
                          No external links provided for this project.
                        </p>
                      </div>
                    )}
                  </div>
                </Section>
              </div>

              {/* Sidebar */}
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
                              project.universityID ||
                              project.creator?.universityID;
                            if (creatorID !== currentUser?.universityID) {
                              onProfileClick?.(creatorID);
                            }
                          }}
                          className={`w-full flex items-center justify-between group bg-amu-gold/5 p-4 rounded-3xl border border-amu-gold/10 transition-all text-left ${project.universityID !== currentUser?.universityID || (project.creator?.universityID && project.creator.universityID !== currentUser?.universityID) ? "hover:bg-amu-gold/10 cursor-pointer" : "cursor-default opacity-80"}`}
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
                            // Collect all unique team members from various possible fields
                            const collaborators =
                              project.collaborations
                                ?.filter((c) => c.requestStatus === "ACCEPTED")
                                .map((c) => c.sender) || [];

                            const directMembers = project.teamMembers || [];

                            // Filter out the creator and duplicates
                            const allMembers = [
                              ...collaborators,
                              ...directMembers,
                            ].filter((m, index, self) => {
                              const mID = m.universityID || m.id;
                              const projectOwnerID =
                                project.universityID ||
                                project.creator?.universityID;
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
                                    const mID =
                                      member.universityID || member.id;
                                    if (mID !== currentUser?.universityID) {
                                      onProfileClick?.(mID);
                                    }
                                  }}
                                  className={`w-full flex items-center justify-between group p-2 rounded-2xl transition-all text-left ${(member.universityID || member.id) !== currentUser?.universityID ? "hover:bg-gray-50 cursor-pointer" : "cursor-default opacity-60"}`}
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
                                        {formatStatus(member.role) ||
                                          "Researcher"}
                                      </p>
                                    </div>
                                  </div>
                                  <ChevronRight
                                    className={`w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 ${(member.universityID || member.id) === currentUser?.universityID ? "hidden" : ""}`}
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

                  {currentUser && !isAdmin && (
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
                                  <CheckCircle2 className="w-4 h-4" />{" "}
                                  Collaborating
                                </span>
                                <span className="hidden group-hover:flex items-center gap-2">
                                  <UserMinus className="w-4 h-4" /> Leave
                                  Project
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
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="p-20 text-center">
          <p className="text-red-500 font-bold">
            Failed to load project details.
          </p>
        </div>
      )}
    </BaseModal>
  );
};

export default ProjectModal;
