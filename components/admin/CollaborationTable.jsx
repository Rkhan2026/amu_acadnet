import React from "react";
import { FileText, Users } from "lucide-react";

const CollaborationTable = ({ projects, onProjectClick, onTeamClick }) => (
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
          {projects.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="p-8 text-center text-gray-500 font-medium"
              >
                No collaborations found in the system.
              </td>
            </tr>
          ) : (
            projects.map((project) => (
              <tr
                key={project.projectID}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="p-6 align-top max-w-[250px]">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <button
                        onClick={() => onProjectClick(project)}
                        className="font-bold text-gray-900 hover:text-amu-green transition-colors text-left text-base line-clamp-2"
                      >
                        {project.title}
                      </button>
                    </div>
                  </div>
                </td>
                <td className="p-6 align-top">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-blue-50 text-blue-500 border-blue-100 whitespace-nowrap">
                    {(project.projectStatus || "PROPOSED").replace(/_/g, " ")}
                  </span>
                </td>
                <td className="p-6 align-top text-sm font-medium text-gray-500 whitespace-nowrap">
                  {new Date(project.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="p-6 align-top">
                  <button
                    onClick={() => onTeamClick(project)}
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
);

export default CollaborationTable;
