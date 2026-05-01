"use client";
import React, { useState, useEffect } from "react";
import { Handshake, AlertCircle } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import UserProfileModal from "@/components/UserProfileModal";
import ProjectModal from "@/components/ProjectModal";
import TeamModal from "@/components/TeamModal";
import CollaborationTable from "@/components/admin/CollaborationTable";

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
        if (data.error) setError(data.error);
        else setCollaborations(data);
      })
      .catch(() => setError("Failed to fetch collaborations"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <LoadingSpinner fullPage message="Loading collaborations list..." />;
  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-500">
        <AlertCircle className="h-10 w-10 mb-4" />
        <h2 className="text-xl font-bold">{error}</h2>
      </div>
    );

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

      <CollaborationTable
        projects={collaborations}
        onProjectClick={setSelectedProjectDetails}
        onTeamClick={setSelectedTeamProject}
      />

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
