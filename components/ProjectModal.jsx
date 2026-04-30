"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LoadingSpinner from "./LoadingSpinner";

const ProjectModal = ({
  isOpen,
  onClose,
  projectID,
  project: initialProject,
  onProfileClick,
  isAdmin: isAdminProp,
}) => {
  const [project, setProject] = useState(initialProject || null);
  const [loading, setLoading] = useState(!initialProject);
  const [currentUser, setCurrentUser] = useState(null);
  const [requested, setRequested] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [collaborationID, setCollaborationID] = useState(null);
  const [prevID, setPrevID] = useState(null);

  // Synchronize state with props
  const currentProjectID = projectID || initialProject?.projectID;
  if (currentProjectID !== prevID) {
    setPrevID(currentProjectID);
    setProject(initialProject || null);
    setLoading(!initialProject && !!projectID);
    setRequested(null);
    setCollaborationID(null);
  }

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading(!project && !initialProject);
        try {
          const [authRes, netRes] = await Promise.all([
            fetch("/api/auth/me").then((r) => r.json()),
            fetch("/api/network").then((r) => r.json()),
          ]);

          if (!authRes.error) setCurrentUser(authRes.user);

          let currentProject = project || initialProject;
          if (projectID && !currentProject) {
            const projRes = await fetch(`/api/projects/${projectID}`).then(
              (r) => r.json(),
            );
            if (!projRes.error) {
              setProject(projRes);
              currentProject = projRes;
            }
          }

          if (currentProject && !netRes.error) {
            const pid = currentProject.projectID;
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
            } else {
              setRequested(null);
              setCollaborationID(null);
            }
          }
        } catch (err) {
          console.error("Error fetching project data:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, projectID, initialProject, project]);

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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            className="relative w-full max-w-6xl max-h-[92vh] bg-gray-50 rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
          >
            {/* Header / Close Button */}
            <div className="absolute top-6 right-6 z-20">
              <button
                onClick={onClose}
                className="p-3 bg-white/80 backdrop-blur-md text-gray-400 hover:text-gray-900 hover:bg-white rounded-2xl transition-all shadow-lg border border-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-20">
                <LoadingSpinner message="Loading Project Details..." />
              </div>
            ) : project ? (
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-8 md:p-12">
                  {/* Admin Back Button (if provided/needed) */}
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
                            Your project was rejected. Please review the
                            feedback, and resubmit.
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
                          <span className="px-6 py-2.5 bg-amu-green/10 text-amu-green text-[10px] font-black uppercase tracking-widest rounded-2xl border border-amu-green/20 shadow-sm">
                            {formatStatus(
                              project.projectDomain || project.domain,
                            )}
                          </span>
                          <span
                            className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 border shadow-sm ${
                              project.projectStatus === "ACTIVE" ||
                              project.projectStatus === "ON_HOLD" ||
                              project.projectStatus === "PROPOSED"
                                ? "bg-amu-green text-white border-amu-green"
                                : "bg-gray-50 text-gray-400 border-gray-100"
                            }`}
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
                          </span>
                          {project.moderationStatus &&
                            project.moderationStatus !== "APPROVED" && (
                              <span
                                className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-2xl border flex items-center gap-2 shadow-sm ${
                                  project.moderationStatus === "REJECTED"
                                    ? "bg-red-50 text-red-600 border-red-100"
                                    : "bg-amber-50 text-amber-600 border-amber-100"
                                }`}
                              >
                                <Clock className="w-4 h-4" />{" "}
                                {formatStatus(project.moderationStatus)}
                              </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight mb-8">
                          {project.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 py-4 border-y border-gray-200/60">
                          <button
                            onClick={() =>
                              onProfileClick?.(
                                project.universityID ||
                                  project.creator?.universityID,
                              )
                            }
                            className="flex items-center gap-3 group text-left"
                          >
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 group-hover:border-amu-green group-hover:shadow-md transition-all overflow-hidden relative flex-shrink-0">
                              {project.creator?.profilePhoto ? (
                                <Image
                                  src={project.creator.profilePhoto}
                                  alt={project.creator.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <User className="h-6 w-6 text-gray-400 group-hover:text-amu-green" />
                              )}
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                Project Creator
                              </p>
                              <p className="font-bold text-gray-900 group-hover:text-amu-green transition-colors">
                                {project.creator?.name ||
                                  project.author ||
                                  "Unknown"}
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
                      <div className="bg-white rounded-[3rem] p-10 lg:p-14 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-10 h-10 bg-amu-green/10 rounded-xl flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-amu-green" />
                          </div>
                          <h2 className="text-2xl font-black text-gray-900">
                            Description
                          </h2>
                        </div>
                        <p className="text-gray-600 font-medium leading-relaxed prose prose-lg max-w-none">
                          {project.description || "No description provided."}
                        </p>
                      </div>

                      {/* External Links */}
                      <div className="bg-gray-50 rounded-[3rem] p-10 border border-gray-100">
                        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                          <ExternalLink className="h-5 w-5 text-amu-green" />
                          External Links
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {project.externalLinks &&
                          project.externalLinks.length > 0 ? (
                            project.externalLinks.map((link, i) => (
                              <a
                                key={i}
                                href={
                                  typeof link === "string"
                                    ? link
                                    : link.url || "#"
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
                      </div>
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
                                {project.submittedAt
                                  ? "Submitted At"
                                  : "Created At"}
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
                                onClick={() =>
                                  onProfileClick?.(
                                    project.universityID ||
                                      project.creator?.universityID,
                                  )
                                }
                                className="w-full flex items-center justify-between group bg-amu-gold/5 p-4 rounded-3xl border border-amu-gold/10 hover:bg-amu-gold/10 transition-all text-left"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-white border border-amu-gold/20 flex items-center justify-center overflow-hidden relative shadow-sm flex-shrink-0">
                                    {project.creator?.profilePhoto ? (
                                      <Image
                                        src={project.creator.profilePhoto}
                                        alt={project.creator.name}
                                        fill
                                        className="object-cover"
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
                                {(
                                  project.collaborations?.filter(
                                    (c) => c.requestStatus === "ACCEPTED",
                                  ) ||
                                  project.teamMembers ||
                                  project.team
                                )?.length > 0 ? (
                                  (
                                    project.collaborations
                                      ?.filter(
                                        (c) => c.requestStatus === "ACCEPTED",
                                      )
                                      .map((c) => c.sender) ||
                                    project.teamMembers ||
                                    project.team
                                  ).map((member, i) => (
                                    <button
                                      key={i}
                                      onClick={() =>
                                        onProfileClick?.(member.universityID)
                                      }
                                      className="w-full flex items-center justify-between group hover:bg-gray-50 p-2 rounded-2xl transition-all text-left"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full border border-gray-100 shadow-sm overflow-hidden relative bg-white flex-shrink-0">
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
                                            {formatStatus(member.role) ||
                                              "Researcher"}
                                          </p>
                                        </div>
                                      </div>
                                      <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                                    </button>
                                  ))
                                ) : (
                                  <div className="p-6 text-center bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl">
                                    <p className="text-[10px] text-gray-400 font-bold italic uppercase tracking-widest">
                                      No additional team members
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {!isAdmin && (
                          <div className="mt-10 pt-8 border-t border-gray-50">
                            {isOwner ? (
                              <Link
                                href={`/projects/${project.projectID}`}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-900/20"
                              >
                                Manage Full Project
                              </Link>
                            ) : (
                              <div className="space-y-4">
                                <button
                                  onClick={
                                    requested === "ACCEPTED"
                                      ? handleLeaveCollaboration
                                      : requested
                                        ? null
                                        : handleSendRequest
                                  }
                                  disabled={
                                    requestLoading || requested === "PENDING"
                                  }
                                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all flex items-center justify-center gap-2 group ${
                                    requested === "PENDING" ||
                                    requested === "ACCEPTED" ||
                                    requestLoading
                                      ? requested === "ACCEPTED"
                                        ? "bg-amu-green/10 text-amu-green shadow-none border border-amu-green/20 hover:bg-red-50 hover:text-red-500 hover:border-red-100"
                                        : "bg-emerald-100 text-emerald-700 shadow-none cursor-not-allowed"
                                      : "bg-amu-green text-white shadow-amu-green/20 hover:shadow-amu-green/40 hover:-translate-y-1"
                                  }`}
                                >
                                  {requestLoading ? (
                                    <Clock className="w-4 h-4 animate-spin" />
                                  ) : requested === "ACCEPTED" ? (
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
                                      <UserPlus className="w-4 h-4" /> Join
                                      Project
                                    </>
                                  )}
                                </button>
                                <Link
                                  href={`/projects/${project.projectID}`}
                                  target="_blank"
                                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                                >
                                  View Full Page
                                </Link>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-20 text-center">
                <p className="text-red-500 font-bold">
                  Failed to load project details.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
