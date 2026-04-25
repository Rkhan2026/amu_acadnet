"use client";
import React, { useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  User,
  Building2,
  FlaskConical,
  Calendar,
  FileText,
  Save,
  X,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  UserMinus,
} from "lucide-react";

import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";

const ProjectDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;

  const [project, setProject] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [requested, setRequested] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [collaborationID, setCollaborationID] = useState(null);

  React.useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch(`/api/projects/${projectId}`).then((r) => r.json()),
      fetch("/api/network").then((r) => r.json()),
    ])
      .then(([authRes, projRes, netRes]) => {
        if (!authRes.error) setCurrentUser(authRes.user);
        if (!projRes.error) {
          const mapped = {
            id: projRes.projectID,
            title: projRes.title,
            domain: projRes.researchDomain,
            department: projRes.creator?.department || "University",
            description: projRes.description,
            projectStatus:
              projRes.projectStatus === "ACTIVE"
                ? "Active"
                : projRes.projectStatus === "ON_HOLD"
                  ? "On Hold"
                  : projRes.projectStatus === "PROPOSED"
                    ? "Proposed"
                    : projRes.projectStatus === "ARCHIVED"
                      ? "Archived"
                      : "Completed",
            leadResearcher: projRes.creator?.name || "Unknown",
            creatorID: projRes.universityID,
            time: new Date(projRes.createdAt).toLocaleDateString(),
            team:
              projRes.collaborations?.map((c) => ({
                requestID: c.requestID,
                name: c.sender?.name || "Member",
                role: c.sender?.role || "Researcher",
                avatar: "/default-avatar.svg",
              })) || [],

            externalLinks: projRes.externalLinks?.map((url) => ({ url })) || [],
          };
          setProject(mapped);
          setEditForm(mapped);
        }
        if (!netRes.error) {
          const sent = netRes.sentCollaborations?.find(
            (c) => c.projectID === projectId,
          );
          const received = netRes.receivedCollaborations?.find(
            (c) => c.projectID === projectId,
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
      .finally(() => setLoading(false));
  }, [projectId]);

  const isOwner =
    currentUser &&
    (project?.creatorID === currentUser.universityID ||
      currentUser.role === "ADMIN");

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          removedMembers: project.team
            .filter(
              (m) => !editForm.team.find((t) => t.requestID === m.requestID),
            )
            .map((m) => m.requestID),
        }),
      });
      if (res.ok) {
        await res.json();
        setProject((prev) => ({ ...prev, ...editForm }));
        setIsEditing(false);
      } else {
        console.error("Failed to save project.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this research project?"))
      return;
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/projects");
      } else {
        alert("Failed to delete project");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setEditForm({ ...project });
    setIsEditing(false);
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

  const handleSendRequest = async () => {
    setRequestLoading(true);
    try {
      const res = await fetch("/api/network/collaboration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectID: projectId,
          receiverID: project.creatorID,
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

  if (loading)
    return <LoadingSpinner fullPage message="Loading project data..." />;

  if (!project) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
          <FileText className="h-10 w-10 text-red-400" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          Project Not Found
        </h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          The research project you are looking for might have been moved or
          archived.
        </p>
        <Link
          href="/projects"
          onClick={(e) => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              e.preventDefault();
              router.back();
            }
          }}
          className="px-8 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link
          href={isOwner ? "/projects" : "/explore"}
          onClick={(e) => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              e.preventDefault();
              router.back();
            }
          }}
          className="group flex items-center gap-2 text-gray-400 hover:text-amu-green font-bold mb-10 transition-colors uppercase tracking-widest text-[10px] w-fit"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Go Back
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-center gap-4">
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.domain}
                  onChange={(e) =>
                    setEditForm({ ...editForm, domain: e.target.value })
                  }
                  className="px-6 py-2 bg-white text-amu-green text-sm font-black uppercase tracking-widest rounded-2xl border-2 border-amu-green focus:outline-none focus:ring-4 focus:ring-amu-green/20"
                />
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
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                    Lead Researcher
                  </p>
                  <p className="font-bold text-gray-900">
                    {project.leadResearcher}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                    Department
                  </p>
                  <p className="font-bold text-gray-900">
                    {project.department}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Description Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[3rem] p-10 lg:p-14 shadow-2xl shadow-gray-200/50 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-amu-green/10 rounded-xl flex items-center justify-center">
                <FlaskConical className="h-5 w-5 text-amu-green" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Description</h2>
            </div>

            <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed">
              {isEditing ? (
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={6}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 focus:outline-none focus:border-amu-green focus:bg-white transition-colors resize-none"
                />
              ) : (
                <p>{project.description}</p>
              )}
            </div>
          </motion.div>

          {/* External Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 rounded-[3rem] p-10 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                <ExternalLink className="h-5 w-5 text-amu-green" />
                External Links
              </h3>
              {isEditing && (
                <button
                  onClick={() =>
                    setEditForm({
                      ...editForm,
                      externalLinks: [
                        ...editForm.externalLinks,
                        { url: "", label: "New Link" },
                      ],
                    })
                  }
                  className="p-2 bg-white text-amu-green rounded-xl border border-gray-200 hover:border-amu-green transition-all"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {isEditing ? (
                editForm.externalLinks.map((link, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={link.url || (typeof link === "string" ? link : "")}
                      onChange={(e) => {
                        const newLinks = [...editForm.externalLinks];
                        newLinks[i] = { url: e.target.value };
                        setEditForm({ ...editForm, externalLinks: newLinks });
                      }}
                      placeholder="https://"
                      className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-amu-green"
                    />
                    <button
                      onClick={() => {
                        const newLinks = editForm.externalLinks.filter(
                          (_, idx) => idx !== i,
                        );
                        setEditForm({ ...editForm, externalLinks: newLinks });
                      }}
                      className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.externalLinks?.map((link, i) => (
                    <a
                      key={i}
                      href={typeof link === "string" ? link : link.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center justify-center group hover:border-amu-green transition-all shadow-sm overflow-hidden"
                    >
                      <p className="text-gray-500 group-hover:text-amu-green transition-colors truncate text-sm font-medium">
                        {typeof link === "string" ? link : link.url}
                      </p>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Sidebar */}
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
                  <span>Created At</span>
                </div>
                <span className="font-black text-gray-900">
                  {project.time || "2d ago"}
                </span>
              </div>
            </div>

            {/* Project Team Section (Visible to Everyone) */}
            <div className="mt-10 pt-8 border-t border-gray-50">
              <div className="space-y-8">
                {/* Lead Researcher Section */}
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">
                    Project Creator
                  </p>
                  <div className="flex items-center justify-between group bg-amu-gold/5 p-4 rounded-3xl border border-amu-gold/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amu-gold/10 border border-amu-gold/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-amu-gold" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-900 text-sm leading-tight">
                          {project.leadResearcher}
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-amu-gold mt-0.5">
                          Lead Researcher
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Collaborators Section */}
                {project.team?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">
                      Collaborators
                    </p>
                    <div className="space-y-4">
                      {(isEditing ? editForm.team : project.team).map(
                        (member, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between group p-3 hover:bg-gray-50 rounded-2xl transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Image
                                src={member.avatar}
                                alt={member.name}
                                width={36}
                                height={36}
                                className="rounded-xl border border-gray-100 shadow-sm"
                              />
                              <div className="text-left">
                                <p className="font-bold text-gray-900 text-sm leading-tight">
                                  {member.name}
                                </p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">
                                  {member.role}
                                </p>
                              </div>
                            </div>
                            {isEditing && (
                              <button
                                onClick={() => {
                                  const newTeam = editForm.team.filter(
                                    (_, idx) => idx !== i,
                                  );
                                  setEditForm({ ...editForm, team: newTeam });
                                }}
                                className="p-2 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                title="Remove Team Member"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>

              {isOwner ? (
                <div className="space-y-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="w-full py-4 bg-amu-green text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-amu-green/20 hover:shadow-amu-green/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="w-full py-4 bg-white text-gray-900 border border-gray-200 rounded-2xl font-black uppercase tracking-widest text-sm hover:border-gray-900 transition-all flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-gray-900/20 hover:shadow-gray-900/40 hover:-translate-y-1 transition-all"
                      >
                        Edit Details
                      </button>
                      <button
                        onClick={handleDelete}
                        className="w-full py-4 text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" /> Delete Project
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                    Interested in Collaborating?
                  </p>
                  <button
                    onClick={
                      requested === "ACCEPTED"
                        ? handleLeaveCollaboration
                        : requested
                          ? null
                          : handleSendRequest
                    }
                    disabled={requestLoading || requested === "PENDING"}
                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all flex items-center justify-center gap-2 group ${
                      requested === "PENDING" ||
                      requested === "ACCEPTED" ||
                      requestLoading
                        ? requested === "ACCEPTED"
                          ? "bg-amu-green/10 text-amu-green shadow-none border border-amu-green/20 hover:bg-red-50 hover:text-red-500 hover:border-red-100"
                          : "bg-emerald-100 text-emerald-700 shadow-emerald-green/10 cursor-not-allowed"
                        : "bg-amu-green text-white shadow-amu-green/20 hover:shadow-amu-green/40 hover:-translate-y-1"
                    }`}
                  >
                    {requestLoading ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" /> Processing...
                      </>
                    ) : requested === "ACCEPTED" ? (
                      <>
                        <span className="group-hover:hidden flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Collaborating
                        </span>
                        <span className="hidden group-hover:flex items-center gap-2">
                          <UserMinus className="w-4 h-4" /> Leave Project
                        </span>
                      </>
                    ) : requested === "PENDING" ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Requested
                      </>
                    ) : (
                      "Send Request"
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
