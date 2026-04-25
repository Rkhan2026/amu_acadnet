"use client";
import React from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Building2,
  Briefcase,
  GraduationCap,
  Edit3,
  BookOpen,
  Clock,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

const ProfileView = ({ user, onEdit }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Not updated recently";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Profile Header Card */}
      <div className="bg-white rounded-4xl p-8 lg:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <GraduationCap className="h-32 w-32 text-amu-green" />
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gray-100">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <User className="w-16 h-16" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                  {user.name || "Academic Researcher"}
                </h1>
              </div>
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-6 py-3 bg-amu-green text-white font-bold rounded-2xl hover:bg-amu-green/90 transition-all shadow-lg shadow-amu-green/20"
              >
                <Edit3 className="h-5 w-5" />
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 text-gray-600 font-medium capitalize">
                <div className="p-2 bg-gray-50 rounded-xl">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                {user.designation || user.role || "Researcher"}
              </div>
              <div className="flex items-center gap-3 text-gray-600 font-medium">
                <div className="p-2 bg-gray-50 rounded-xl">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                {user.department || "General Academics"}
              </div>
              <div className="flex items-center gap-3 text-gray-600 font-medium">
                <div className="p-2 bg-gray-50 rounded-xl">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                </div>
                ID: {user.universityID || user.universityId || "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* User Stats Bar */}
        <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
          <div className="text-center group-hover:bg-gray-50 p-4 rounded-3xl transition-all border-r border-gray-100">
            <p className="text-2xl lg:text-3xl font-black text-amu-green">
              {user.stats?.projects || 0}
            </p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              Projects Created
            </p>
          </div>
          <div className="text-center group-hover:bg-gray-50 p-4 rounded-3xl transition-all">
            <p className="text-2xl lg:text-3xl font-black text-blue-500">
              {user.stats?.collaborators || 0}
            </p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              Collaborations
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* About / Biography */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-4xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-amu-green/10 rounded-xl">
                <User className="h-5 w-5 text-amu-green" />
              </div>
              Biography
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
              {user.biography ||
                user.academicProfile?.biography ||
                "No biography provided yet. This researcher is dedicated to their field of study at Aligarh Muslim University."}
            </p>
          </div>

          <div className="bg-white rounded-4xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-amu-gold/10 rounded-xl">
                <BookOpen className="h-5 w-5 text-amu-gold" />
              </div>
              Research Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {(
                user.researchInterests ||
                user.academicProfile?.researchInterests ||
                ""
              )
                .split(",")
                .filter((i) => i.trim() !== "")
                .map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gray-50 text-gray-700 font-bold rounded-xl border border-gray-100 hover:border-amu-green/30 hover:bg-amu-green/5 transition-all cursor-default"
                  >
                    {interest.trim()}
                  </span>
                ))}
              {!(
                user.researchInterests ||
                user.academicProfile?.researchInterests
              ) && (
                <span className="text-gray-400 text-sm italic">
                  No specific interests listed.
                </span>
              )}
            </div>
          </div>

          {/* Projects Created Section */}
          <div className="bg-white rounded-4xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Briefcase className="h-5 w-5 text-blue-500" />
              </div>
              Projects Created
            </h3>

            <div className="space-y-6">
              {user.createdProjects?.length > 0 ? (
                user.createdProjects.map((project) => (
                  <Link
                    key={project.projectID}
                    href={`/projects/${project.projectID}`}
                    className="block bg-white border border-gray-100 p-8 rounded-3xl hover:border-amu-green/30 hover:shadow-xl hover:shadow-gray-200/40 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all">
                      <ExternalLink className="h-5 w-5 text-amu-green" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="px-3 py-1 bg-amu-green/5 text-amu-green text-[10px] font-black uppercase tracking-widest rounded-lg border border-amu-green/10">
                            {project.researchDomain}
                          </span>
                          <span
                            className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                              project.projectStatus === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                : "bg-amu-gold/5 text-amu-gold border border-amu-gold/10"
                            }`}
                          >
                            {project.projectStatus}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-black text-gray-900 text-xl group-hover:text-amu-green transition-colors mb-2">
                            {project.title}
                          </h4>
                          <p className="text-gray-500 text-sm font-medium line-clamp-2 max-w-2xl">
                            {project.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 pt-2">
                          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                          {project.moderationStatus === "APPROVED" && (
                            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Verified Research
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                  <Briefcase className="h-8 w-8 text-gray-300 mb-3" />
                  <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">
                    No projects created yet
                  </p>
                  <Link
                    href="/projects/create"
                    className="mt-4 text-amu-green font-black text-xs uppercase tracking-widest hover:underline"
                  >
                    Create your first project
                  </Link>
                </div>
              )}
            </div>
          </div>
          {/* Collaborations Section */}
          <div className="bg-white rounded-4xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <div className="p-2 bg-amu-gold/10 rounded-xl">
                <CheckCircle2 className="h-5 w-5 text-amu-gold" />
              </div>
              Collaborations
            </h3>

            <div className="space-y-6">
              {[
                ...(user.sentCollaborations || []),
                ...(user.receivedCollaborations || []),
              ].length > 0 ? (
                [
                  ...(user.sentCollaborations || []),
                  ...(user.receivedCollaborations || []),
                ].map((collab, index) => (
                  <Link
                    key={`collab-${index}`}
                    href={`/projects/${collab.project.projectID}`}
                    className="block bg-white border border-gray-100 p-8 rounded-3xl hover:border-amu-gold/30 hover:shadow-xl hover:shadow-gray-200/40 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all">
                      <ExternalLink className="h-5 w-5 text-amu-gold" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="px-3 py-1 bg-amu-gold/5 text-amu-gold text-[10px] font-black uppercase tracking-widest rounded-lg border border-amu-gold/10">
                            {collab.project.researchDomain}
                          </span>
                          <span
                            className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                              collab.project.projectStatus === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                : "bg-amu-gold/5 text-amu-gold border border-amu-gold/10"
                            }`}
                          >
                            {collab.project.projectStatus}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-black text-gray-900 text-xl group-hover:text-amu-gold transition-colors mb-2">
                            {collab.project.title}
                          </h4>
                          <p className="text-gray-500 text-sm font-medium line-clamp-2 max-w-2xl">
                            {collab.project.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="h-8 w-8 text-gray-300 mb-3" />
                  <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">
                    No collaborations yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-8">
          <div className="bg-white rounded-4xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6">
              Status & Contact
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <Mail className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Email Address
                  </p>
                  <p className="font-bold text-gray-900">
                    {user.email ||
                      (user.handle
                        ? `${user.handle.replace("@", "")}@gmail.com`
                        : "N/A")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-amu-green/5 rounded-2xl">
                  <Clock className="h-6 w-6 text-amu-green" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Last Updated
                  </p>
                  <p className="font-bold text-gray-900 text-sm">
                    {formatDate(user.academicProfile?.lastUpdated)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
