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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LoadingSpinner from "./LoadingSpinner";

const ProjectModal = ({ isOpen, onClose, projectID }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [requested, setRequested] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [collaborationID, setCollaborationID] = useState(null);

  useEffect(() => {
    if (isOpen && projectID) {
      setLoading(true);
      Promise.all([
        fetch("/api/auth/me").then((r) => r.json()),
        fetch(`/api/projects/${projectID}`).then((r) => r.json()),
        fetch("/api/network").then((r) => r.json()),
      ])
        .then(([authRes, projRes, netRes]) => {
          if (!authRes.error) setCurrentUser(authRes.user);
          if (!projRes.error) {
            setProject(projRes);
          }
          if (!netRes.error) {
            const sent = netRes.sentCollaborations?.find(
              (c) => c.projectID === projectID,
            );
            const received = netRes.receivedCollaborations?.find(
              (c) => c.projectID === projectID,
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
        })
        .catch((err) => console.error("Error fetching project:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, projectID]);

  const handleSendRequest = async () => {
    setRequestLoading(true);
    try {
      const res = await fetch("/api/network/collaboration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectID: projectID,
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

  const isOwner =
    currentUser &&
    (project?.universityID === currentUser.universityID ||
      currentUser.role === "ADMIN");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
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
            className="relative w-full max-w-5xl max-h-[90vh] bg-gray-50 rounded-4xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
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
                  <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="flex-1 space-y-10">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                          <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amu-green/10 text-amu-green">
                            {project.researchDomain}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              project.projectStatus === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : "bg-amu-gold/10 text-amu-gold border-amu-gold/20"
                            }`}
                          >
                            {project.projectStatus}
                          </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight mb-8">
                          {project.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 py-4 border-y border-gray-200/60">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                              <User className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                Lead Researcher
                              </p>
                              <p className="font-bold text-gray-900">
                                {project.creator?.name || "Unknown"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                              <Building2 className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                Department
                              </p>
                              <p className="font-bold text-gray-900">
                                {project.creator?.department || "University"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-amu-green/10 rounded-xl flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-amu-green" />
                          </div>
                          <h2 className="text-2xl font-black text-gray-900">
                            Description
                          </h2>
                        </div>
                        <p className="text-gray-600 font-medium leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {/* External Links */}
                      {project.externalLinks &&
                        project.externalLinks.length > 0 && (
                          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                              <ExternalLink className="h-5 w-5 text-amu-green" />
                              External Resources
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {project.externalLinks.map((link, i) => (
                                <a
                                  key={i}
                                  href={
                                    typeof link === "string"
                                      ? link
                                      : link.url || "#"
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center justify-center group hover:border-amu-green transition-all"
                                >
                                  <p className="text-gray-500 group-hover:text-amu-green transition-colors truncate text-sm font-medium">
                                    {typeof link === "string" ? link : link.url}
                                  </p>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-80 shrink-0 space-y-6">
                      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                          Project Info
                        </p>

                        <div className="space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-gray-50 rounded-xl">
                              <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-400">
                                Created On
                              </p>
                              <p className="text-sm font-black text-gray-900">
                                {new Date(
                                  project.createdAt,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {project.collaborations &&
                            project.collaborations.length > 0 && (
                              <div className="pt-6 border-t border-gray-50">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                                  Team Members
                                </p>
                                <div className="space-y-4">
                                  {project.collaborations
                                    .filter(
                                      (c) => c.requestStatus === "ACCEPTED",
                                    )
                                    .map((c, i) => (
                                      <div
                                        key={i}
                                        className="flex items-center gap-3"
                                      >
                                        <Image
                                          src="/default-avatar.svg"
                                          alt={c.sender?.name}
                                          width={32}
                                          height={32}
                                          className="rounded-lg border border-gray-100"
                                        />
                                        <div>
                                          <p className="font-bold text-gray-900 text-xs">
                                            {c.sender?.name}
                                          </p>
                                          <p className="text-[8px] font-black uppercase text-gray-400">
                                            {c.sender?.role}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                        </div>

                        <div className="mt-10 pt-8 border-t border-gray-50">
                          {isOwner ? (
                            <Link
                              href={`/projects/${project.projectID}`}
                              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl"
                            >
                              Manage Project
                            </Link>
                          ) : (
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
                              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all flex items-center justify-center gap-2 group ${
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
                                  <UserPlus className="w-4 h-4" /> Join Project
                                </>
                              )}
                            </button>
                          )}
                          {!isOwner && (
                            <Link
                              href={`/projects/${project.projectID}`}
                              target="_blank"
                              className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                            >
                              View Full Page
                            </Link>
                          )}
                        </div>
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
