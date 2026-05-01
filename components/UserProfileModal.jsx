"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Building2,
  Briefcase,
  GraduationCap,
  BookOpen,
  Clock,
  CheckCircle2,
  UserPlus,
  Check,
  ChevronDown,
  XCircle,
} from "lucide-react";

import Image from "next/image";
import ProjectModal from "./ProjectModal";
import BaseModal from "./ui/BaseModal";
import Badge from "./ui/Badge";
import Avatar from "./ui/Avatar";
import Section from "./ui/Section";
import Button from "./ui/Button";
import ProjectCard from "./ui/ProjectCard";
import LoadingSpinner from "./LoadingSpinner";

const UserProfileModal = ({
  isOpen,
  onClose,
  universityID,
  onAdminAction,
  zIndex,
}) => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingStatus, setFollowingStatus] = useState(null);
  const [selectedProjectID, setSelectedProjectID] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [prevId, setPrevId] = useState(null);
  const [currentUserID, setCurrentUserID] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [showInviteMenu, setShowInviteMenu] = useState(false);
  const [inviteStatus, setInviteStatus] = useState({}); // projectID -> status
  const [networkData, setNetworkData] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  if (universityID !== prevId) {
    setPrevId(universityID);
    setLoading(true);
    setUser(null);
    setProjects([]);
  }

  useEffect(() => {
    if (isOpen && universityID) {
      Promise.all([
        fetch(`/api/profile/${universityID}`).then((res) => res.json()),
        fetch(`/api/projects?universityID=${universityID}`).then((res) =>
          res.json(),
        ),
        fetch("/api/network").then((res) => res.json()),
      ])
        .then(([userData, projectData, netData]) => {
          if (!userData.error) {
            setUser(userData);
          }
          if (!projectData.error) {
            setProjects(projectData);
          }
          if (!netData.error) {
            setNetworkData(netData);
            if (netData.following) {
              const rel = netData.following.find(
                (f) => f.followingID === universityID,
              );
              setFollowingStatus(rel ? rel.requestStatus : null);
            }
            if (netData.currentUser) {
              setCurrentUserID(netData.currentUser.universityID);
              setCurrentUserRole(netData.currentUser.role);
              // Fetch current user's projects for invitation feature
              fetch(
                `/api/projects?universityID=${netData.currentUser.universityID}`,
              )
                .then((res) => res.json())
                .then((projects) => {
                  if (!projects.error) setMyProjects(projects);
                })
                .catch((err) =>
                  console.error("Error fetching my projects:", err),
                );
            }
          }
        })

        .catch((err) => console.error("Error fetching user profile:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, universityID]);

  const handleFollowToggle = async () => {
    const isFollowing = !!followingStatus;
    // Optimistic update
    setFollowingStatus(isFollowing ? null : "PENDING");

    try {
      const res = await fetch("/api/network/follow", {
        method: isFollowing ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetID: universityID }),
      });
      if (!res.ok) {
        // Revert on error
        setFollowingStatus(isFollowing ? "ACCEPTED" : null);
        const err = await res.json();
        alert(err.error || "Action failed");
      }
    } catch (err) {
      console.error("Follow toggle error:", err);
      setFollowingStatus(isFollowing ? "ACCEPTED" : null);
    }
  };

  const handleInvite = async (projectID) => {
    // Optimistic update
    setInviteStatus((prev) => ({ ...prev, [projectID]: "SENDING" }));

    try {
      const res = await fetch("/api/network/collaboration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectID, receiverID: universityID }),
      });

      if (res.ok) {
        setInviteStatus((prev) => ({ ...prev, [projectID]: "SENT" }));
        // Update network data locally to show pending invite
        const newInvite = await res.json();
        setNetworkData((prev) => ({
          ...prev,
          sentCollaborations: [...(prev.sentCollaborations || []), newInvite],
        }));

        setTimeout(() => {
          setShowInviteMenu(false);
        }, 1500);
      } else {
        const data = await res.json();
        if (data.error === "Collaboration request already sent") {
          setInviteStatus((prev) => ({ ...prev, [projectID]: "ALREADY_SENT" }));
        } else {
          setInviteStatus((prev) => ({ ...prev, [projectID]: "ERROR" }));
        }
      }
    } catch (err) {
      console.error("Invite error:", err);
      setInviteStatus((prev) => ({ ...prev, [projectID]: "ERROR" }));
    }
  };

  const handleCancelInvite = async (requestID, projectID) => {
    // Optimistic update
    setInviteStatus((prev) => ({ ...prev, [projectID]: "CANCELING" }));
    const originalNetworkData = { ...networkData };
    setNetworkData((prev) => ({
      ...prev,
      sentCollaborations: prev.sentCollaborations.filter(
        (c) => c.requestID !== requestID,
      ),
    }));

    try {
      const res = await fetch("/api/network/collaboration", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestID }),
      });

      if (res.ok) {
        setInviteStatus((prev) => ({ ...prev, [projectID]: null }));
      } else {
        setInviteStatus((prev) => ({ ...prev, [projectID]: "ERROR" }));
        setNetworkData(originalNetworkData); // Revert
      }
    } catch (err) {
      console.error("Cancel invite error:", err);
      setInviteStatus((prev) => ({ ...prev, [projectID]: "ERROR" }));
      setNetworkData(originalNetworkData); // Revert
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not updated recently";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="max-w-5xl"
        zIndex={zIndex}
      >
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20">
            <LoadingSpinner message="Loading User Profile..." />
          </div>
        ) : user ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto custom-scrollbar"
          >
            {/* Profile Header Banner */}
            <div className="relative h-48 bg-gradient-to-r from-amu-green to-[#004d26]">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            </div>

            <div className="px-8 md:px-12 -mt-20 pb-12">
              <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                {/* Avatar */}
                <Avatar
                  src={user.profilePhoto}
                  alt={user.name}
                  size="2xl"
                  className="border-8 border-white shadow-2xl"
                />

                {/* Basic Info */}
                <div className="flex-1 md:pt-24">
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                    {user.name}
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="success" icon={Briefcase}>
                      {user.role}
                    </Badge>
                    <Badge variant="gold" icon={Building2}>
                      {user.department || "General Academics"}
                    </Badge>
                    <Badge variant="default" icon={GraduationCap}>
                      ID: {user.universityID}
                    </Badge>

                    {universityID !== currentUserID &&
                      currentUserRole &&
                      currentUserRole.toUpperCase() !== "ADMIN" &&
                      user.role?.toUpperCase() !== "ADMIN" && (
                        <div className="flex gap-2 relative">
                          <Button
                            variant={
                              followingStatus === "ACCEPTED"
                                ? "primary"
                                : followingStatus === "PENDING"
                                  ? "ghost"
                                  : "outline"
                            }
                            size="sm"
                            onClick={handleFollowToggle}
                            className={`h-10 ${
                              followingStatus === "PENDING"
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-default opacity-70"
                                : ""
                            }`}
                            icon={followingStatus ? Check : UserPlus}
                            disabled={followingStatus === "PENDING"}
                          >
                            {followingStatus
                              ? followingStatus === "ACCEPTED"
                                ? "Following"
                                : "Requested"
                              : "Follow"}
                          </Button>

                          {myProjects.length > 0 && (
                            <div className="relative">
                              <Button
                                onClick={() =>
                                  setShowInviteMenu(!showInviteMenu)
                                }
                                size="sm"
                                className="h-10 bg-[#004d26] hover:bg-amu-green"
                                icon={Mail}
                              >
                                Invite to Project
                                <ChevronDown
                                  className={`h-3 w-3 transition-transform ${showInviteMenu ? "rotate-180" : ""}`}
                                />
                              </Button>

                              <AnimatePresence>
                                {showInviteMenu && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60]"
                                  >
                                    <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Select Project
                                      </p>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                      {myProjects.map((project) => {
                                        const existingCollab =
                                          networkData?.sentCollaborations?.find(
                                            (c) =>
                                              c.projectID ===
                                                project.projectID &&
                                              c.receiverID === universityID,
                                          );
                                        const isPending =
                                          existingCollab?.requestStatus ===
                                          "PENDING";
                                        const isAccepted =
                                          existingCollab?.requestStatus ===
                                          "ACCEPTED";
                                        const isProcessing =
                                          inviteStatus[project.projectID] ===
                                            "SENDING" ||
                                          inviteStatus[project.projectID] ===
                                            "CANCELING";

                                        return (
                                          <div
                                            key={project.projectID}
                                            className={`w-full px-4 py-3 border-b border-gray-50 last:border-0 flex flex-col gap-2 transition-all ${
                                              isPending || isAccepted
                                                ? "bg-gray-50/50"
                                                : "hover:bg-gray-50"
                                            }`}
                                          >
                                            <div className="flex justify-between items-start">
                                              <div className="flex flex-col gap-0.5">
                                                <span
                                                  className={`text-sm font-bold transition-colors ${isPending || isAccepted ? "text-gray-400" : "text-gray-900"}`}
                                                >
                                                  {project.title}
                                                </span>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                  {project.projectDomain}
                                                </span>
                                              </div>
                                              {isAccepted && (
                                                <Badge
                                                  variant="success"
                                                  className="px-2 py-0.5 h-auto"
                                                >
                                                  Joined
                                                </Badge>
                                              )}
                                            </div>

                                            {!isAccepted && (
                                              <div className="flex items-center justify-between mt-1">
                                                {isPending ? (
                                                  <button
                                                    onClick={() =>
                                                      handleCancelInvite(
                                                        existingCollab.requestID,
                                                        project.projectID,
                                                      )
                                                    }
                                                    disabled={isProcessing}
                                                    className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline disabled:opacity-50"
                                                  >
                                                    {inviteStatus[
                                                      project.projectID
                                                    ] === "CANCELING"
                                                      ? "Canceling..."
                                                      : "Cancel Invitation"}
                                                  </button>
                                                ) : (
                                                  <button
                                                    onClick={() =>
                                                      handleInvite(
                                                        project.projectID,
                                                      )
                                                    }
                                                    disabled={isProcessing}
                                                    className="text-[10px] font-black text-amu-green uppercase tracking-widest hover:underline disabled:opacity-50"
                                                  >
                                                    {inviteStatus[
                                                      project.projectID
                                                    ] === "SENDING"
                                                      ? "Sending..."
                                                      : "Send Invite"}
                                                  </button>
                                                )}

                                                {inviteStatus[
                                                  project.projectID
                                                ] &&
                                                  !isProcessing && (
                                                    <span className="text-[10px] font-black text-amu-gold uppercase tracking-widest">
                                                      {inviteStatus[
                                                        project.projectID
                                                      ] === "SENT"
                                                        ? "Sent"
                                                        : inviteStatus[
                                                              project.projectID
                                                            ] === "ERROR"
                                                          ? "Error"
                                                          : ""}
                                                    </span>
                                                  )}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}

                          {/* Admin Actions */}
                          {currentUserRole?.toUpperCase() === "ADMIN" &&
                            onAdminAction &&
                            user.accountStatus === "PENDING" && (
                              <div className="flex gap-3">
                                <Button
                                  onClick={() =>
                                    onAdminAction(user.universityID, "approve")
                                  }
                                  size="sm"
                                  icon={CheckCircle2}
                                >
                                  Verify User
                                </Button>
                                <Button
                                  onClick={() =>
                                    onAdminAction(user.universityID, "reject")
                                  }
                                  variant="danger"
                                  size="sm"
                                  icon={XCircle}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}

                          {currentUserRole?.toUpperCase() === "ADMIN" &&
                            user.accountStatus !== "PENDING" && (
                              <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                  Account Status:
                                </span>
                                <Badge
                                  variant={
                                    user.accountStatus === "APPROVED"
                                      ? "success"
                                      : "error"
                                  }
                                >
                                  {user.accountStatus}
                                </Badge>
                              </div>
                            )}
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
                {/* Left Column - Biography & Projects */}
                <div className="lg:col-span-2 space-y-12">
                  {/* Biography */}
                  <Section title="Biography" icon={User} variant="gray">
                    <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                      {user.academicProfile?.biography ||
                        "No biography provided yet. This researcher is dedicated to their field of study at Aligarh Muslim University."}
                    </p>
                  </Section>

                  {/* Projects Created */}
                  <section>
                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-xl">
                        <Briefcase className="h-5 w-5 text-blue-500" />
                      </div>
                      Projects Created
                    </h3>
                    <div className="space-y-4">
                      {projects.length > 0 ? (
                        projects.map((project, index) => (
                          <ProjectCard
                            key={project.projectID || index}
                            project={project}
                            onClick={() => {
                              setSelectedProjectID(project.projectID);
                              setIsProjectModalOpen(true);
                            }}
                          />
                        ))
                      ) : (
                        <div className="py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                          <Briefcase className="h-8 w-8 text-gray-300 mb-3" />
                          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">
                            No projects listed
                          </p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Collaborating In Section */}
                  <section>
                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                      <div className="p-2 bg-amu-gold/10 rounded-xl">
                        <CheckCircle2 className="h-5 w-5 text-amu-gold" />
                      </div>
                      Collaborations
                    </h3>
                    <div className="space-y-4">
                      {(() => {
                        const groupedCollabs = {};
                        [
                          ...(user.sentCollaborations || []),
                          ...(user.receivedCollaborations || []),
                        ].forEach((c) => {
                          const pid = c.project.projectID;
                          const creatorID = c.project.universityID;
                          if (creatorID === user.universityID) return;

                          const partnerID =
                            c.senderID === user.universityID
                              ? c.receiverID
                              : c.senderID;

                          if (!groupedCollabs[pid]) {
                            groupedCollabs[pid] = {
                              ...c,
                              partners: [],
                              partnerIDs: [],
                            };
                            groupedCollabs[pid].partnerIDs.push(
                              user.universityID,
                            );
                          }

                          if (
                            partnerID !== creatorID &&
                            partnerID !== user.universityID &&
                            !groupedCollabs[pid].partnerIDs.includes(partnerID)
                          ) {
                            groupedCollabs[pid].partnerIDs.push(partnerID);
                          }
                        });

                        const collabs = Object.values(groupedCollabs);

                        return collabs.length > 0 ? (
                          collabs.map((collab, index) => (
                            <ProjectCard
                              key={`collab-${index}`}
                              project={collab.project}
                              variant="gold"
                              onClick={() => {
                                setSelectedProjectID(collab.project.projectID);
                                setIsProjectModalOpen(true);
                              }}
                            />
                          ))
                        ) : (
                          <div className="py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                            <CheckCircle2 className="h-8 w-8 text-gray-300 mb-3" />
                            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">
                              No collaborations yet
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </section>
                </div>

                {/* Right Column - Stats & Interests */}
                <div className="space-y-8">
                  {/* Contact Info */}
                  <div className="bg-white rounded-4xl p-8 shadow-xl shadow-gray-200/40 border border-gray-100">
                    <h3 className="text-lg font-black text-gray-900 mb-6">
                      Contact & Status
                    </h3>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-2xl">
                          <Mail className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Email Address
                          </p>
                          <p className="font-bold text-gray-900 break-all">
                            {user.email || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-amu-green/5 rounded-2xl">
                          <Clock className="h-6 w-6 text-amu-green" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Last Updated
                          </p>
                          <p className="font-bold text-gray-900">
                            {formatDate(user.academicProfile?.lastUpdated)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Research Interests */}
                  <div className="bg-white rounded-4xl p-8 shadow-xl shadow-gray-200/40 border border-gray-100">
                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-amu-gold" />
                      Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(user.academicProfile?.researchInterests || "")
                        .split(",")
                        .filter((i) => i.trim() !== "")
                        .map((interest, idx) => (
                          <Badge
                            key={idx}
                            variant="default"
                            className="normal-case h-auto py-1"
                          >
                            {interest.trim()}
                          </Badge>
                        ))}
                      {!user.academicProfile?.researchInterests && (
                        <p className="text-gray-400 text-xs italic">
                          No interests listed.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-6 rounded-3xl text-center">
                      <p className="text-2xl font-black text-amu-green">
                        {projects.length}
                      </p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                        Projects
                      </p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-3xl text-center">
                      <p className="text-2xl font-black text-amu-gold">
                        {
                          Object.keys(
                            [
                              ...(user.sentCollaborations || []),
                              ...(user.receivedCollaborations || []),
                            ].reduce((acc, c) => {
                              if (
                                c.project.universityID !== user.universityID
                              ) {
                                acc[c.project.projectID] = true;
                              }
                              return acc;
                            }, {}),
                          ).length
                        }
                      </p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                        Collaborations
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="p-20 text-center">
            <p className="text-red-500 font-bold">
              Failed to load user profile.
            </p>
          </div>
        )}
      </BaseModal>
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projectID={selectedProjectID}
        zIndex="z-[500]"
      />
      {modalImage && (
        <div
          className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setModalImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors bg-black/50 rounded-full z-10"
            >
              <X className="h-6 w-6" />
            </button>
            <Image
              src={modalImage}
              alt="Preview"
              width={1200}
              height={800}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfileModal;
