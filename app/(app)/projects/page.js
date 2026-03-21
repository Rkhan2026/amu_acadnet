"use client";

import React from "react";
import Link from "next/link";
import {
  Plus,
  Briefcase,
  Clock,
  CheckCircle2,
  MoreVertical,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
export default function MyProjectsPage() {
  const [myProjects, setMyProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
    ])
      .then(([authRes, projRes]) => {
        if (!authRes.error && !projRes.error) {
          const mine = projRes.filter(
            (p) => p.creatorID === authRes.user?.universityID,
          );
          setMyProjects(
            mine.map((p) => ({
              id: p.projectID,
              title: p.title,
              domain: p.researchDomain,
              projectStatus:
                p.projectStatus === "ACTIVE" ? "Active" : p.projectStatus,
              approvalStatus:
                p.moderationStatus === "APPROVED"
                  ? "Approved"
                  : p.moderationStatus === "PENDING"
                    ? "Pending"
                    : "Rejected",
              description: p.description || "No description provided.",
              time: new Date(p.createdAt).toLocaleDateString(),
            })),
          );
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-8 px-4 md:px-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            My Projects
          </h1>
          <p className="text-gray-500 font-medium">
            Manage your research projects, track progress, and create new
            initiatives.
          </p>
        </div>
        <Link
          href="/projects/create"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-amu-green text-white font-bold rounded-2xl hover:bg-[#004d26] transition-all shadow-xl shadow-amu-green/20"
        >
          <Plus className="h-5 w-5" />
          Create New Project
        </Link>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-full">
            <LoadingSpinner fullPage message="Loading your projects..." />
          </div>
        ) : myProjects.length > 0 ? (
          myProjects.map((project) => (
            <MyProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="col-span-full py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-6">
            <div className="p-4 bg-gray-100 rounded-2xl mb-4">
              <Briefcase className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-500 max-w-xs mb-8">
              You haven&apos;t registered any research projects. Start by
              creating your first project!
            </p>
            <Link
              href="/projects/create"
              className="px-8 py-3 bg-white border border-gray-200 text-amu-green font-bold rounded-xl hover:border-amu-green transition-all"
            >
              Start First Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function MyProjectCard({ project }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-gray-200/40 border border-gray-100/50 hover:border-amu-green/30 transition-all group relative">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amu-green/5 rounded-2xl border border-amu-green/10">
            <Briefcase className="h-6 w-6 text-amu-green" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amu-green/10 text-amu-green`}
              >
                {project.domain}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  project.projectStatus === "Active"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amu-gold/10 text-amu-gold"
                }`}
              >
                {project.projectStatus}
              </span>
              {project.approvalStatus && (
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${
                    project.approvalStatus === "Approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {project.approvalStatus === "Pending" && (
                    <Clock className="w-3 h-3" />
                  )}
                  {project.approvalStatus === "Approved" && (
                    <CheckCircle2 className="w-3 h-3" />
                  )}
                  {project.approvalStatus}
                </span>
              )}
            </div>
            <h3 className="text-xl font-black text-gray-900 group-hover:text-amu-green transition-colors leading-tight">
              {project.title}
            </h3>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      <p className="text-gray-600 font-medium mb-8 line-clamp-2">
        {project.description}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-50">
        <div className="flex items-center gap-2 text-gray-400 font-medium text-sm">
          <Clock className="h-4 w-4" />
          <span>Created {project.time}</span>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/projects/${project.id}`}
            className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all flex items-center gap-2"
          >
            Manage
          </Link>
        </div>
      </div>
    </div>
  );
}
