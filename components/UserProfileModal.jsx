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
  ExternalLink,
  UserPlus,
  Check,
  ChevronDown,
} from "lucide-react";

import Image from "next/image";
import ProjectModal from "./ProjectModal";

const UserProfileModal = ({ isOpen, onClose, universityID }) => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingStatus, setFollowingStatus] = useState(null);
  const [selectedProjectID, setSelectedProjectID] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [prevId, setPrevId] = useState(null);
  const [currentUserID, setCurrentUserID] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [showInviteMenu, setShowInviteMenu] = useState(false);
  const [inviteStatus, setInviteStatus] = useState({}); // projectID -> status
  const [networkData, setNetworkData] = useState(null);
  if (universityID !== prevId) {
    setPrevId(universityID);
    if (universityID) {
      setLoading(true);
      setUser(null);
      setProjects([]);
    }
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
    try {
      const res = await fetch("/api/network/follow", {
        method: isFollowing ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetID: universityID }),
      });
      if (res.ok) {
        setFollowingStatus(isFollowing ? null : "PENDING");
      }
    } catch (err) {
      console.error("Follow toggle error:", err);
    }
  };

  const handleInvite = async (projectID) => {
    try {
      setInviteStatus((prev) => ({ ...prev, [projectID]: "SENDING" }));
      const res = await fetch("/api/network/collaboration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectID, receiverID: universityID }),
      });

      if (res.ok) {
        setInviteStatus((prev) => ({ ...prev, [projectID]: "SENT" }));
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
    try {
      setInviteStatus((prev) => ({ ...prev, [projectID]: "CANCELING" }));
      const res = await fetch("/api/network/collaboration", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestID }),
      });

      if (res.ok) {
        setInviteStatus((prev) => ({ ...prev, [projectID]: null }));
        // Refresh network data to reflect the change
        const netRes = await fetch("/api/network");
        const netData = await netRes.json();
        if (!netData.error) setNetworkData(netData);
      } else {
        setInviteStatus((prev) => ({ ...prev, [projectID]: "ERROR" }));
      }
    } catch (err) {
      console.error("Cancel invite error:", err);
      setInviteStatus((prev) => ({ ...prev, [projectID]: "ERROR" }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not updated recently";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div
            key="user-profile-modal-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          >
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
              className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-4xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
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
                  <div className="w-16 h-16 border-4 border-amu-green/20 border-t-amu-green rounded-full animate-spin mb-4" />
                  <p className="text-gray-500 font-bold animate-pulse">
                    Loading Researcher Profile...
                  </p>
                </div>
              ) : user ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {/* Profile Header Banner */}
                  <div className="relative h-48 bg-gradient-to-r from-amu-green to-[#004d26]">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                  </div>

                  <div className="px-8 md:px-12 -mt-20 pb-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                      {/* Avatar */}
                      <div className="relative w-40 h-40 rounded-4xl overflow-hidden border-8 border-white shadow-2xl bg-gray-50">
                        <Image
                          src={user.avatar || "/default-avatar.svg"}
                          alt={user.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Basic Info */}
                      <div className="flex-1 md:pt-24">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                          {user.name}
                        </h2>
                        <div className="flex flex-wrap gap-4">
                          <span className="flex items-center gap-2 px-4 py-2 bg-amu-green/5 text-amu-green font-black rounded-xl text-xs uppercase tracking-widest border border-amu-green/10">
                            <Briefcase className="h-3 w-3" />
                            {user.role}
                          </span>
                          <span className="flex items-center gap-2 px-4 py-2 bg-amu-gold/5 text-amu-gold font-black rounded-xl text-xs uppercase tracking-widest border border-amu-gold/10">
                            <Building2 className="h-3 w-3" />
                            {user.department || "General Academics"}
                          </span>
                          <span className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-500 font-black rounded-xl text-xs uppercase tracking-widest border border-blue-100">
                            <GraduationCap className="h-3 w-3" />
                            {user.universityID}
                          </span>
                          {universityID !== currentUserID && (
                            <div className="flex gap-2 relative">
                              <button
                                onClick={handleFollowToggle}
                                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                  followingStatus
                                    ? "bg-amu-green text-white shadow-lg shadow-amu-green/20"
                                    : "bg-white text-gray-400 border-2 border-gray-100 hover:border-amu-green hover:text-amu-green"
                                }`}
                              >
                                {followingStatus ? (
                                  <>
                                    <Check className="h-3 w-3" />
                                    {followingStatus === "ACCEPTED"
                                      ? "Following"
                                      : "Requested"}
                                  </>
                                ) : (
                                  <>
                                    <UserPlus className="h-3 w-3" />
                                    Follow
                                  </>
                                )}
                              </button>

                              {myProjects.length > 0 && (
                                <div className="relative">
                                  <button
                                    onClick={() =>
                                      setShowInviteMenu(!showInviteMenu)
                                    }
                                    className="flex items-center gap-2 px-6 py-2 bg-[#004d26] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amu-green transition-all shadow-lg shadow-amu-green/10"
                                  >
                                    <Mail className="h-3 w-3" />
                                    Invite to Project
                                    <ChevronDown
                                      className={`h-3 w-3 transition-transform ${showInviteMenu ? "rotate-180" : ""}`}
                                    />
                                  </button>

                                  <AnimatePresence>
                                    {showInviteMenu && (
                                      <motion.div
                                        initial={{
                                          opacity: 0,
                                          y: 10,
                                          scale: 0.95,
                                        }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{
                                          opacity: 0,
                                          y: 10,
                                          scale: 0.95,
                                        }}
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
                                              inviteStatus[
                                                project.projectID
                                              ] === "SENDING" ||
                                              inviteStatus[
                                                project.projectID
                                              ] === "CANCELING";

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
                                                      className={`text-sm font-bold transition-colors ${
                                                        isPending || isAccepted
                                                          ? "text-gray-400"
                                                          : "text-gray-900"
                                                      }`}
                                                    >
                                                      {project.title}
                                                    </span>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                      {project.researchDomain}
                                                    </span>
                                                  </div>
                                                  {isAccepted && (
                                                    <span className="text-[10px] font-black text-amu-green uppercase tracking-widest bg-amu-green/10 px-2 py-0.5 rounded-md">
                                                      Joined
                                                    </span>
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
                                                                  project
                                                                    .projectID
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
                        <section>
                          <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                            <div className="p-2 bg-amu-green/10 rounded-xl">
                              <User className="h-5 w-5 text-amu-green" />
                            </div>
                            Biography
                          </h3>
                          <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap bg-gray-50 p-6 rounded-3xl border border-gray-100/50">
                            {user.academicProfile?.biography ||
                              "No biography provided yet. This researcher is dedicated to their field of study at Aligarh Muslim University."}
                          </p>
                        </section>

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
                                <button
                                  key={project.projectID || index}
                                  onClick={() => {
                                    setSelectedProjectID(project.projectID);
                                    setIsProjectModalOpen(true);
                                  }}
                                  className="w-full text-left block bg-white border border-gray-100 p-6 rounded-3xl hover:border-amu-green/30 hover:shadow-xl hover:shadow-gray-200/40 transition-all group"
                                >
                                  <div className="flex justify-between items-start mb-4">
                                    <div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-gray-100">
                                          {project.researchDomain}
                                        </span>
                                        <span
                                          className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                                            project.projectStatus === "ACTIVE"
                                              ? "bg-emerald-50 text-emerald-600"
                                              : "bg-amu-gold/5 text-amu-gold"
                                          }`}
                                        >
                                          {project.projectStatus}
                                        </span>
                                      </div>
                                      <h4 className="font-black text-gray-900 text-lg group-hover:text-amu-green transition-colors">
                                        {project.title}
                                      </h4>
                                      <div className="mt-2 space-y-0.5">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                          Creator:{" "}
                                          <span className="text-gray-700 normal-case font-bold">
                                            {user.universityID === currentUserID
                                              ? `${user.name} (You)`
                                              : user.name}
                                          </span>
                                        </p>
                                        {(() => {
                                          const collaborators = (
                                            project.collaborations || []
                                          )
                                            .map((c) => {
                                              const partner =
                                                c.senderID === user.universityID
                                                  ? c.receiver
                                                  : c.sender;
                                              return partner;
                                            })
                                            .filter(
                                              (p) =>
                                                p &&
                                                p.universityID !==
                                                  user.universityID,
                                            );

                                          const uniqueCollabs = Array.from(
                                            new Map(
                                              collaborators.map((c) => [
                                                c.universityID,
                                                c,
                                              ]),
                                            ).values(),
                                          );

                                          if (uniqueCollabs.length === 0)
                                            return null;

                                          return (
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                              Team:{" "}
                                              <span className="text-amu-gold normal-case font-bold">
                                                {uniqueCollabs
                                                  .slice(0, 2)
                                                  .map((m) =>
                                                    m.universityID ===
                                                    currentUserID
                                                      ? `${m.name} (You)`
                                                      : m.name,
                                                  )
                                                  .join(", ")}
                                                {uniqueCollabs.length > 2 &&
                                                  ` +${uniqueCollabs.length - 2} others`}
                                              </span>
                                            </p>
                                          );
                                        })()}
                                      </div>
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                      <ExternalLink className="h-4 w-4 text-gray-400" />
                                    </div>
                                  </div>
                                  <p className="text-gray-500 text-sm line-clamp-2 font-medium">
                                    {project.description}
                                  </p>
                                  <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5">
                                      <Clock className="h-3 w-3" />
                                      {new Date(
                                        project.createdAt,
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </button>
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

                                const partnerName =
                                  c.senderID === user.universityID
                                    ? c.receiver?.name
                                    : c.sender?.name;
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

                                  // Add the profile owner (since they are a member)
                                  const isOwnerMe =
                                    user.universityID === currentUserID;
                                  const ownerName = isOwnerMe
                                    ? `${user.name} (You)`
                                    : user.name;
                                  groupedCollabs[pid].partners.push(ownerName);
                                  groupedCollabs[pid].partnerIDs.push(
                                    user.universityID,
                                  );
                                }

                                // Add the partner if they are not the creator and not the owner
                                if (
                                  partnerID !== creatorID &&
                                  partnerID !== user.universityID &&
                                  !groupedCollabs[pid].partnerIDs.includes(
                                    partnerID,
                                  )
                                ) {
                                  const isPartnerMe =
                                    partnerID === currentUserID;
                                  const finalPartnerName = isPartnerMe
                                    ? `${partnerName} (You)`
                                    : partnerName;
                                  groupedCollabs[pid].partners.push(
                                    finalPartnerName,
                                  );
                                  groupedCollabs[pid].partnerIDs.push(
                                    partnerID,
                                  );
                                }
                              });

                              const collabs = Object.values(groupedCollabs);

                              return collabs.length > 0 ? (
                                collabs.map((collab, index) => (
                                  <button
                                    key={`collab-${index}`}
                                    onClick={() => {
                                      setSelectedProjectID(
                                        collab.project.projectID,
                                      );
                                      setIsProjectModalOpen(true);
                                    }}
                                    className="w-full text-left block bg-white border border-gray-100 p-6 rounded-3xl hover:border-amu-gold/30 hover:shadow-xl hover:shadow-gray-200/40 transition-all group"
                                  >
                                    <div className="flex justify-between items-start mb-4">
                                      <div>
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-gray-100">
                                            {collab.project.researchDomain}
                                          </span>
                                          <span
                                            className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                                              collab.project.projectStatus ===
                                              "ACTIVE"
                                                ? "bg-emerald-50 text-emerald-600"
                                                : "bg-amu-gold/5 text-amu-gold"
                                            }`}
                                          >
                                            {collab.project.projectStatus}
                                          </span>
                                        </div>
                                        <h4 className="font-black text-gray-900 text-lg group-hover:text-amu-gold transition-colors">
                                          {collab.project.title}
                                        </h4>
                                        <div className="mt-2 space-y-0.5">
                                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Creator:{" "}
                                            <span className="text-gray-700 normal-case font-bold">
                                              {collab.project.creator
                                                ?.universityID === currentUserID
                                                ? `${collab.project.creator?.name} (You)`
                                                : collab.project.creator
                                                    ?.name || "Unknown"}
                                            </span>
                                          </p>
                                          {collab.partners.length > 0 && (
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                              Team:{" "}
                                              <span className="text-amu-gold normal-case font-bold">
                                                {collab.partners
                                                  .slice(0, 2)
                                                  .join(", ")}
                                                {collab.partners.length > 2 &&
                                                  ` +${collab.partners.length - 2} others`}
                                              </span>
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="p-2 bg-gray-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ExternalLink className="h-4 w-4 text-gray-400" />
                                      </div>
                                    </div>
                                    <p className="text-gray-500 text-sm line-clamp-2 font-medium mb-4">
                                      {collab.project.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest pt-2">
                                      <Clock className="h-3 w-3" />
                                      {formatDate(collab.project.createdAt)}
                                    </div>
                                  </button>
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
                                  {formatDate(
                                    user.academicProfile?.lastUpdated,
                                  )}
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
                                <span
                                  key={idx}
                                  className="px-3 py-1.5 bg-gray-50 text-gray-600 font-bold text-xs rounded-xl border border-gray-100 hover:border-amu-green/30 hover:bg-amu-green/5 transition-all cursor-default"
                                >
                                  {interest.trim()}
                                </span>
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
                                      c.project.universityID !==
                                      user.universityID
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
                </div>
              ) : (
                <div className="p-20 text-center">
                  <p className="text-red-500 font-bold">
                    Failed to load user profile.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projectID={selectedProjectID}
      />
    </>
  );
};

export default UserProfileModal;
