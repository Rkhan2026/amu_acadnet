import React, { memo } from "react";
import Link from "next/link";
import { Briefcase, CheckCircle2, Clock, ExternalLink } from "lucide-react";

const ProjectItem = ({ project, user, isCollaboration, onProjectClick }) => {
  const content = (
    <>
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all">
        <ExternalLink
          className={`h-5 w-5 ${isCollaboration ? "text-amu-gold" : "text-amu-green"}`}
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${isCollaboration ? "bg-amu-gold/5 text-amu-gold border-amu-gold/10" : "bg-amu-green/5 text-amu-green border-amu-green/10"}`}
            >
              {project.projectDomain}
            </span>
            <span
              className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${project.projectStatus === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amu-gold/5 text-amu-gold border border-amu-gold/10"}`}
            >
              {project.projectStatus}
            </span>
          </div>

          <div className="text-left">
            <h4
              className={`font-black text-gray-900 text-xl transition-colors mb-2 ${isCollaboration ? "group-hover:text-amu-gold" : "group-hover:text-amu-green"}`}
            >
              {project.title}
            </h4>
            <div className="mb-2 space-y-0.5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Creator:{" "}
                <span className="text-gray-700 normal-case font-bold">
                  {!isCollaboration ||
                  project.creator?.universityID === user.universityID
                    ? `${user.name} (You)`
                    : project.creator?.name || "Unknown"}
                </span>
              </p>
            </div>
            <p className="text-gray-500 text-sm font-medium line-clamp-2 max-w-2xl">
              {project.description}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest pt-2">
            <Clock className="h-3.5 w-3.5" />
            {new Date(project.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </>
  );

  if (onProjectClick) {
    return (
      <button
        onClick={() => onProjectClick(project.projectID)}
        className={`w-full block bg-white border border-gray-100 p-8 rounded-3xl transition-all group relative overflow-hidden hover:shadow-xl hover:shadow-gray-200/40 ${isCollaboration ? "hover:border-amu-gold/30" : "hover:border-amu-green/30"}`}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={`/projects/${project.projectID}`}
      className={`block bg-white border border-gray-100 p-8 rounded-3xl transition-all group relative overflow-hidden hover:shadow-xl hover:shadow-gray-200/40 ${isCollaboration ? "hover:border-amu-gold/30" : "hover:border-amu-green/30"}`}
    >
      {content}
    </Link>
  );
};

const ProjectsSection = memo(({ user, onProjectClick }) => {
  const collabs = Object.values(
    [
      ...(user.sentCollaborations || []),
      ...(user.receivedCollaborations || []),
    ].reduce((acc, c) => {
      const pid = c.project.projectID;
      if (c.project.universityID === user.universityID) return acc;
      if (!acc[pid]) acc[pid] = c.project;
      return acc;
    }, {}),
  );

  return (
    <div className="lg:col-span-2 space-y-8">
      <div className="bg-white rounded-4xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
        <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <Briefcase className="h-5 w-5 text-blue-500" />
          </div>
          Projects Created
        </h3>
        <div className="space-y-6">
          {user.createdProjects?.length > 0 ? (
            user.createdProjects.map((p) => (
              <ProjectItem
                key={p.projectID}
                project={p}
                user={user}
                onProjectClick={onProjectClick}
              />
            ))
          ) : (
            <div className="py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-center">
              <Briefcase className="h-8 w-8 text-gray-300 mx-auto mb-3" />
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

      <div className="bg-white rounded-4xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
        <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
          <div className="p-2 bg-amu-gold/10 rounded-xl">
            <CheckCircle2 className="h-5 w-5 text-amu-gold" />
          </div>
          Collaborations
        </h3>
        <div className="space-y-6">
          {collabs.length > 0 ? (
            collabs.map((p) => (
              <ProjectItem
                key={p.projectID}
                project={p}
                user={user}
                isCollaboration
                onProjectClick={onProjectClick}
              />
            ))
          ) : (
            <div className="py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-center">
              <CheckCircle2 className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">
                No collaborations yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ProjectsSection.displayName = "ProjectsSection";
export default ProjectsSection;
