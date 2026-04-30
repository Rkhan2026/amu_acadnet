"use client";
import React, { Suspense } from "react";
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  Calendar,
  User,
  Type,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import UserProfileModal from "@/components/UserProfileModal";
import ProjectModal from "@/components/ProjectModal";

const RejectionModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialFeedback,
}) => {
  const [feedback, setFeedback] = React.useState("");

  React.useEffect(() => {
    if (isOpen) setFeedback("");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-12 border border-gray-100"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-4 bg-red-50 rounded-2xl mb-6">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">
              Reject Project
            </h2>
            <p className="text-gray-600 font-bold text-sm leading-relaxed max-w-xs">
              Please provide reason for rejection to help the creator update
              their project for resubmission.
            </p>
          </div>

          <div className="space-y-6">
            {initialFeedback && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Previous Admin Feedback
                </label>
                <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                  <p className="text-sm font-bold text-gray-500 italic leading-relaxed">
                    &quot;{initialFeedback}&quot;
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                {initialFeedback
                  ? "New Admin Feedback"
                  : "Admin Feedback (Required)"}
              </label>
              <textarea
                autoFocus
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="e.g., Description is too vague, please add more technical details..."
                className="w-full h-36 p-6 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-red-500 focus:bg-white focus:ring-0 transition-all text-gray-900 text-base font-bold resize-none placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-10">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-4 bg-gray-100 text-gray-600 font-black rounded-xl hover:bg-gray-200 transition-all uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(feedback)}
              disabled={isSubmitting || !feedback.trim()}
              className="px-6 py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all uppercase tracking-widest text-xs shadow-lg shadow-red-600/30 disabled:opacity-50 disabled:shadow-none"
            >
              {isSubmitting ? "Processing..." : "Submit"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ProjectCard = ({ project, onAction, onClick }) => (
  <div
    onClick={() => onClick(project)}
    className="bg-white p-8 rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in slide-in-from-right-4 duration-500 hover:border-amu-green/30 transition-all group cursor-pointer"
  >
    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
      <div className="flex gap-6 items-center">
        <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-amu-green/5 transition-colors">
          <BookOpen className="h-8 w-8 text-gray-400 group-hover:text-amu-green transition-colors" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-black text-gray-900 leading-tight">
            {project.title}
          </h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-500 font-medium text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {project.author}
            </div>
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              {project.domain || project.type}
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="h-4 w-4" />
              {project.submittedAt}
            </div>
            {project.moderationStatus !== "PENDING" && (
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  project.moderationStatus === "APPROVED"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : project.moderationStatus === "REJECTED"
                      ? "bg-red-100 text-red-700 border-red-200"
                      : "bg-amber-100 text-amber-700 border-amber-200"
                }`}
              >
                {project.moderationStatus.replace(/_/g, " ")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        {project.moderationStatus !== "APPROVED" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction(project.id, "approve");
            }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-amu-green text-white font-bold rounded-2xl hover:bg-amu-green/90 transition-all shadow-lg shadow-amu-green/20"
          >
            <CheckCircle2 className="h-5 w-5" />
            Approve
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAction(project.id, "reject");
          }}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <XCircle className="h-5 w-5" />
          {project.moderationStatus === "REJECTED" ? "Edit Reason" : "Reject"}
        </button>
      </div>
    </div>
  </div>
);

function ModerationContent() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = React.useState([]);
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [rejectionTarget, setRejectionTarget] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [mode, setMode] = React.useState(searchParams.get("mode") || "PENDING");
  const [profileUniversityID, setProfileUniversityID] = React.useState(null);

  React.useEffect(() => {
    const m = searchParams.get("mode");
    if (m) setMode(m);
  }, [searchParams]);

  React.useEffect(() => {
    setLoading(true);
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setProjects(
            data.map((p) => ({
              id: p.projectID,
              title: p.title,
              author: p.creator?.name || "Unknown",
              department: p.creator?.department || "",
              domain: p.projectDomain || p.type,
              moderationStatus: p.moderationStatus,
              type: p.projectDomain,
              rawDate: p.createdAt || Date.now(),
              submittedAt: new Date(p.createdAt || Date.now()).toLocaleString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                },
              ),
              description: p.description,
              adminFeedback: p.adminFeedback,
              projectStatus: p.projectStatus,
              externalLinks: p.externalLinks?.map((url) => ({ url })),
              creatorID: p.universityID,
              team: p.teamMembers?.map((m) => ({
                universityID: m.universityID,
                name: m.name,
                role: m.role || "Researcher",
              })),
            })),
          );
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = React.useMemo(() => {
    return projects
      .filter((p) => p.moderationStatus === mode)
      .sort((a, b) => new Date(b.rawDate || 0) - new Date(a.rawDate || 0));
  }, [projects, mode]);

  const counts = React.useMemo(() => {
    return {
      PENDING: projects.filter((p) => p.moderationStatus === "PENDING").length,
      APPROVED: projects.filter((p) => p.moderationStatus === "APPROVED")
        .length,
      REJECTED: projects.filter((p) => p.moderationStatus === "REJECTED")
        .length,
    };
  }, [projects]);

  const handleProjAction = async (id, action) => {
    try {
      if (action === "reject") {
        const proj = projects.find((p) => p.id === id);
        setRejectionTarget(proj);
        return;
      }

      const moderationStatus = action === "approve" ? "APPROVED" : "REJECTED";
      const res = await fetch(`/api/projects/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moderationStatus }),
      });

      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, moderationStatus } : p)),
        );
        if (selectedProject?.id === id) {
          setSelectedProject(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectionConfirm = async (feedback) => {
    if (!rejectionTarget || !feedback.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${rejectionTarget.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moderationStatus: "REJECTED",
          adminFeedback: feedback,
        }),
      });

      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === rejectionTarget.id
              ? { ...p, moderationStatus: "REJECTED", adminFeedback: feedback }
              : p,
          ),
        );
        setRejectionTarget(null);
        if (selectedProject?.id === rejectionTarget.id) {
          setSelectedProject(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
            Admin Moderation
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Manage institutional data integrity for research projects.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white p-1.5 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 w-fit">
          {[
            { label: "Pending", value: "PENDING" },
            { label: "Approved", value: "APPROVED" },
            { label: "Rejected", value: "REJECTED" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setMode(tab.value)}
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                mode === tab.value
                  ? "bg-amu-green text-white shadow-lg shadow-amu-green/20"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  mode === tab.value
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {counts[tab.value]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <LoadingSpinner message="Loading records..." />
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((proj) => (
            <div key={proj.id} className="relative">
              <ProjectCard
                project={proj}
                onClick={setSelectedProject}
                onAction={handleProjAction}
              />
            </div>
          ))
        ) : (
          <EmptyState
            icon={BookOpen}
            title={
              mode === "PENDING"
                ? "All caught up!"
                : mode === "APPROVED"
                  ? "No Approved Projects"
                  : "No Rejected Projects"
            }
            description={
              mode === "PENDING"
                ? "No pending research projects to review."
                : mode === "APPROVED"
                  ? "The institutional research registry currently has no approved projects."
                  : "There are no projects in the rejection audit history."
            }
          />
        )}
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          onProfileClick={setProfileUniversityID}
          isAdmin={true}
        />
      )}

      <UserProfileModal
        isOpen={!!profileUniversityID}
        onClose={() => setProfileUniversityID(null)}
        universityID={profileUniversityID}
      />

      <RejectionModal
        isOpen={!!rejectionTarget}
        onClose={() => setRejectionTarget(null)}
        onSubmit={handleRejectionConfirm}
        isSubmitting={isSubmitting}
        initialFeedback={rejectionTarget?.adminFeedback}
      />
    </div>
  );
}

export default function ModerationPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Accessing records..." />}>
      <ModerationContent />
    </Suspense>
  );
}

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-20 rounded-4xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
    <div className="p-6 bg-gray-50 rounded-3xl mb-6">
      <Icon size={48} className="text-gray-300" />
    </div>
    <h3 className="text-2xl font-black text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 font-medium">{description}</p>
  </div>
);
