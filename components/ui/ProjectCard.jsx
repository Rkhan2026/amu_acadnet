import React from "react";
import { Clock, ExternalLink } from "lucide-react";
import Badge from "./Badge";

const ProjectCard = ({
  project,
  onClick,
  variant = "default",
  className = "",
}) => {
  const isGold = variant === "gold";

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left block bg-white border border-gray-100 p-6 rounded-3xl transition-all group hover:shadow-xl hover:shadow-gray-200/40 ${
        isGold ? "hover:border-amu-gold/30" : "hover:border-amu-green/30"
      } ${className}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="default">
              {project.projectDomain || project.domain}
            </Badge>
            <Badge
              variant={project.projectStatus === "ACTIVE" ? "success" : "gold"}
            >
              {project.projectStatus}
            </Badge>
          </div>

          <h4
            className={`font-black text-gray-900 text-lg transition-colors ${
              isGold
                ? "group-hover:text-amu-gold"
                : "group-hover:text-amu-green"
            }`}
          >
            {project.title}
          </h4>

          <div className="mt-2 space-y-0.5">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Creator:{" "}
              <span className="text-gray-700 normal-case font-bold">
                {project.creator?.name || project.author || "Unknown"}
              </span>
            </p>
          </div>
        </div>

        <div className="p-2 bg-gray-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <p className="text-gray-500 text-sm line-clamp-2 font-medium mb-4">
        {project.description}
      </p>

      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          {formatDate(project.createdAt || project.submittedAt)}
        </span>
      </div>
    </button>
  );
};

export default ProjectCard;
