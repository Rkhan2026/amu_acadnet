import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

const MyProjectsHeader = () => {
  return (
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
  );
};

export default MyProjectsHeader;
