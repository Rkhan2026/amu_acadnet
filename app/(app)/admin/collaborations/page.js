"use client";

import React, { useState, useEffect } from "react";
import {
  Handshake,
  AlertCircle,
  User,
  FileText,
  Eye,
  ArrowLeft,
  BookOpen,
  Building2,
  Calendar,
  X,
  Crown,
  Users,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AdminCollaborationsPage() {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeamProject, setSelectedTeamProject] = useState(null);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);

  useEffect(() => {
    fetch("/api/admin/collaborations")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setCollaborations(data);
        }
      })
      .catch(() => setError("Failed to fetch collaborations"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage message="Loading collaborations list..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-500">
        <AlertCircle className="h-10 w-10 mb-4" />
        <h2 className="text-xl font-bold">{error}</h2>
      </div>
    );
  }

  // The API now returns exactly the unique list of projects with active team members,
  // matching the dashboard logic precisely.
  const uniqueProjectsList = collaborations;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <div className="p-3 bg-amu-green/10 rounded-2xl">
              <Handshake className="h-8 w-8 text-amu-green" />
            </div>
            All Collaborations
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Monitor all academic collaborations within the network.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  Project
                </th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  Status
                </th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  Date
                </th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  Team
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {uniqueProjectsList.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-gray-500 font-medium"
                  >
                    No collaborations found in the system.
                  </td>
                </tr>
              ) : (
                uniqueProjectsList.map((project) => (
                  <tr
                    key={project.projectID}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-6 align-top max-w-[250px]">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                        <div>
                          <button
                            onClick={() => setSelectedProjectDetails(project)}
                            className="font-bold text-gray-900 hover:text-amu-green transition-colors text-left text-base line-clamp-2"
                          >
                            {project.title}
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 align-top">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-blue-50 text-blue-500 border-blue-100 whitespace-nowrap">
                        {project.projectStatus || "PROPOSED"}
                      </span>
                    </td>
                    <td className="p-6 align-top text-sm font-medium text-gray-500 whitespace-nowrap">
                      {new Date(project.createdAt).toLocaleDateString(
                        undefined,
                        { year: "numeric", month: "short", day: "numeric" },
                      )}
                    </td>
                    <td className="p-6 align-top">
                      <button
                        onClick={() => setSelectedTeamProject(project)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 hover:bg-amu-green hover:border-amu-green hover:text-white rounded-lg transition-all text-xs font-bold uppercase tracking-tight whitespace-nowrap"
                      >
                        <Eye className="h-4 w-4" />
                        View Team Members
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTeamProject && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-gray-900 leading-tight">
                  Project Team
                </h3>
                <p className="text-sm font-medium text-gray-500 mt-1 line-clamp-1">
                  {selectedTeamProject.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedTeamProject(null)}
                className="p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amu-gold" />
                  Project Creator
                </h4>
                <div className="flex items-center gap-3 p-4 bg-amu-gold/5 border border-amu-gold/10 rounded-2xl">
                  <div className="h-10 w-10 rounded-full bg-amu-gold/20 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-amu-gold" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {selectedTeamProject.creator?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedTeamProject.creator?.email}
                    </p>
                    <p className="text-xs text-amu-gold font-semibold uppercase tracking-wider mt-0.5">
                      {selectedTeamProject.creator?.role}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-amu-green" />
                  Team Members ({selectedTeamProject.teamMembers?.length || 0})
                </h4>
                <div className="space-y-3">
                  {selectedTeamProject.teamMembers?.length > 0 ? (
                    selectedTeamProject.teamMembers.map((member, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl"
                      >
                        <div className="h-10 w-10 rounded-full bg-amu-green/10 flex items-center justify-center shrink-0">
                          <User className="h-5 w-5 text-amu-green" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {member.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {member.email}
                          </p>
                          <p className="text-xs text-amu-green font-semibold uppercase tracking-wider mt-0.5">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic p-4 text-center bg-gray-50 border border-gray-100 rounded-2xl">
                      No additional team members currently.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedProjectDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedProjectDetails(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-50 w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-300"
          >
            <div className="p-8 md:p-14 pb-0 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <button
                onClick={() => setSelectedProjectDetails(null)}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold text-sm uppercase tracking-widest mb-10 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>

              <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 pb-14">
                {/* Main Content Area */}
                <div className="flex-1 space-y-12">
                  {/* Header Information */}
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amu-green/10 text-amu-green">
                        {selectedProjectDetails.researchDomain ||
                          "Research Project"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          selectedProjectDetails.moderationStatus === "APPROVED"
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : selectedProjectDetails.moderationStatus ===
                                "REJECTED"
                              ? "bg-red-100 text-red-700 border-red-200"
                              : "bg-amber-100 text-amber-700 border-amber-200"
                        }`}
                      >
                        {selectedProjectDetails.moderationStatus || "PENDING"}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-blue-50 text-blue-500 border-blue-100">
                        {selectedProjectDetails.projectStatus || "PROPOSED"}
                      </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight mb-8">
                      {selectedProjectDetails.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-8 py-4 border-y border-gray-200/60">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                          <User className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                            Project Creator
                          </p>
                          <p className="font-bold text-gray-900">
                            {selectedProjectDetails.creator?.name || "Unknown"}
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
                            {selectedProjectDetails.creator?.department ||
                              "Not Specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-amu-green/10 rounded-xl flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-amu-green" />
                      </div>
                      <h2 className="text-2xl font-black text-gray-900">
                        Description
                      </h2>
                    </div>
                    <p className="text-gray-600 font-medium leading-relaxed prose prose-lg max-w-none">
                      {selectedProjectDetails.description ||
                        "No description provided."}
                    </p>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-80 shrink-0 space-y-6">
                  <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-8">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                      Execution Status
                    </p>

                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400">
                          Submitted At
                        </p>
                        <p className="text-sm font-black text-gray-900">
                          {selectedProjectDetails.createdAt
                            ? new Date(
                                selectedProjectDetails.createdAt,
                              ).toLocaleDateString()
                            : "Unknown"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-50">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                        Project Team Members
                      </p>
                      <div className="space-y-6 mb-8">
                        {selectedProjectDetails.teamMembers &&
                        selectedProjectDetails.teamMembers.length > 0 ? (
                          selectedProjectDetails.teamMembers.map(
                            (member, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 border border-gray-200">
                                  <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <div className="text-left overflow-hidden">
                                  <p className="font-bold text-gray-900 text-sm leading-tight truncate">
                                    {member.name}
                                  </p>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-amu-green mt-0.5">
                                    {member.role}
                                  </p>
                                </div>
                              </div>
                            ),
                          )
                        ) : (
                          <p className="text-sm text-gray-500 italic">
                            No additional team members currently.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
