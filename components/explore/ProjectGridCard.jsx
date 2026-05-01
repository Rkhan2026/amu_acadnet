import React, { memo } from "react";
import { BookOpen, Users, Building2, Tag } from "lucide-react";
import { motion } from "framer-motion";

const ProjectGridCard = memo(({ project, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}
      className="group bg-white p-6 rounded-3xl border border-gray-100 hover:border-amu-green/30 transition-all hover:shadow-2xl hover:shadow-gray-200/50 flex flex-col justify-between cursor-pointer"
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="relative h-12 w-12 rounded-2xl overflow-hidden flex items-center justify-center bg-amu-gold/10 text-amu-gold">
            <BookOpen className="h-6 w-6" />
          </div>
          <span className="px-3 py-1 bg-amu-green/5 text-amu-green text-[10px] font-black uppercase tracking-widest rounded-full">
            {project.projectStatus
              ?.replace(/_/g, " ")
              .toLowerCase()
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </span>
        </div>

        <div className="flex items-center gap-1.5 mb-1 text-amu-gold">
          <Tag className="h-3 w-3" />
          <p className="text-[10px] font-black uppercase tracking-widest">
            {project.domain || project.projectDomain}
          </p>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amu-green transition-colors">
          {project.title}
        </h3>

        <div className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
          <div className="space-y-4">
            <p className="line-clamp-2">{project.description}</p>
            {project.requirements && project.requirements.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.requirements.slice(0, 3).map((req, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[9px] font-bold uppercase tracking-wider rounded-md border border-gray-100"
                  >
                    {req}
                  </span>
                ))}
                {project.requirements.length > 3 && (
                  <span className="text-[9px] font-bold text-gray-300 self-center">
                    + {project.requirements.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700 font-black text-xs uppercase tracking-tighter">
            <Users className="h-4 w-4 shrink-0 text-amu-gold" />
            <span className="truncate text-gray-900">
              CREATOR: {project.projectCreator}
            </span>
          </div>

          {project.teamMembers?.length > 0 && (
            <div className="flex flex-col gap-1 pl-6">
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">
                TEAM MEMBERS
              </p>
              {project.teamMembers.slice(0, 2).map((tm, i) => (
                <span
                  key={i}
                  className="text-[10px] font-bold text-gray-400 uppercase tracking-tight"
                >
                  • {tm.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-tighter pt-2 border-t border-gray-50">
            <Building2 className="h-4 w-4 shrink-0" />
            <span className="truncate">{project.department}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ProjectGridCard.displayName = "ProjectGridCard";
export default ProjectGridCard;
