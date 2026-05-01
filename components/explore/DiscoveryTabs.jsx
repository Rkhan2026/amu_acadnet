import React from "react";
import { BookOpen, Users } from "lucide-react";

const DiscoveryTabs = ({
  activeTab,
  onTabChange,
  projectCount,
  userCount,
  isFilteringProjects,
  isFilteringUsers,
}) => (
  <div className="flex items-center gap-2 p-1.5 bg-gray-100/50 rounded-2xl w-fit">
    <button
      onClick={() => onTabChange("projects")}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${
        activeTab === "projects"
          ? "bg-white text-amu-green shadow-md"
          : "text-gray-400 hover:text-gray-600"
      }`}
    >
      <BookOpen className="h-4 w-4" />
      Projects
      <span className="ml-2 px-2 py-0.5 bg-gray-100 text-[10px] rounded-md min-w-[20px] flex items-center justify-center h-5">
        {activeTab === "projects" && isFilteringProjects ? (
          <div className="w-2 h-2 border-2 border-amu-green/30 border-t-amu-green rounded-full animate-spin" />
        ) : (
          projectCount
        )}
      </span>
    </button>
    <button
      onClick={() => onTabChange("users")}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${
        activeTab === "users"
          ? "bg-white text-amu-green shadow-md"
          : "text-gray-400 hover:text-gray-600"
      }`}
    >
      <Users className="h-4 w-4" />
      Users
      <span className="ml-2 px-2 py-0.5 bg-gray-100 text-[10px] rounded-md min-w-[20px] flex items-center justify-center h-5">
        {activeTab === "users" && isFilteringUsers ? (
          <div className="w-2 h-2 border-2 border-amu-green/30 border-t-amu-green rounded-full animate-spin" />
        ) : (
          userCount
        )}
      </span>
    </button>
  </div>
);

export default DiscoveryTabs;
