"use client";

import React, { useState, useEffect } from "react";
import { Handshake, AlertCircle, FileText, Users } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import UserProfileModal from "@/components/UserProfileModal";
import ProjectModal from "@/components/ProjectModal";
import TeamModal from "@/components/TeamModal";

export default function AdminCollaborationsPage() {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeamProject, setSelectedTeamProject] = useState(null);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
  const [profileUniversityID, setProfileUniversityID] = useState(null);

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
                        {(project.projectStatus || "PROPOSED").replace(
                          /_/g,
                          " ",
                        )}
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
                        <Users className="h-4 w-4" />
                        View Team
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProjectModal
        project={selectedProjectDetails}
        isOpen={!!selectedProjectDetails}
        onClose={() => setSelectedProjectDetails(null)}
        onProfileClick={setProfileUniversityID}
        isAdmin={true}
      />

      <TeamModal
        project={selectedTeamProject}
        isOpen={!!selectedTeamProject}
        onClose={() => setSelectedTeamProject(null)}
        onProfileClick={setProfileUniversityID}
      />

      <UserProfileModal
        isOpen={!!profileUniversityID}
        onClose={() => setProfileUniversityID(null)}
        universityID={profileUniversityID}
      />
    </div>
  );
}
