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
        .then(([userData, projectData, networkData]) => {
          if (!userData.error) {
            setUser(userData);
          }
          if (!projectData.error) {
            setProjects(projectData);
          }
          if (!networkData.error && networkData.following) {
            const rel = networkData.following.find(
              (f) => f.followingID === universityID,
            );
            setFollowingStatus(rel ? rel.requestStatus : null);
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

  const formatDate = (dateString) => {
    if (!dateString) return "Not updated recently";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
                            projects.map((project) => (
                              <button
                                key={project.projectID}
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
                                  {project.moderationStatus === "APPROVED" && (
                                    <span className="flex items-center gap-1.5 text-emerald-600">
                                      <CheckCircle2 className="h-3 w-3" />
                                      Verified
                                    </span>
                                  )}
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
                          {[
                            ...(user.sentCollaborations || []),
                            ...(user.receivedCollaborations || []),
                          ].filter(
                            (collab) =>
                              collab.project.universityID !== user.universityID,
                          ).length > 0 ? (
                            [
                              ...(user.sentCollaborations || []),
                              ...(user.receivedCollaborations || []),
                            ]
                              .filter(
                                (collab) =>
                                  collab.project.universityID !==
                                  user.universityID,
                              )
                              .map((collab, index) => (
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
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                      <ExternalLink className="h-4 w-4 text-gray-400" />
                                    </div>
                                  </div>
                                  <p className="text-gray-500 text-sm line-clamp-2 font-medium">
                                    {collab.project.description}
                                  </p>
                                </button>
                              ))
                          ) : (
                            <div className="py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                              <CheckCircle2 className="h-8 w-8 text-gray-300 mb-3" />
                              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">
                                No collaborations yet
                              </p>
                            </div>
                          )}
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
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Email Address
                              </p>
                              <p className="font-bold text-gray-900 truncate max-w-[150px]">
                                {user.email || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-amu-green/5 rounded-2xl">
                              <Clock className="h-6 w-6 text-amu-green" />
                            </div>
                            <div>
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
                              [
                                ...(user.sentCollaborations || []),
                                ...(user.receivedCollaborations || []),
                              ].filter(
                                (c) =>
                                  c.project.universityID !== user.universityID,
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
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projectID={selectedProjectID}
      />
    </AnimatePresence>
  );
};

export default UserProfileModal;
