import React from "react";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import MyProjectCard from "./MyProjectCard";

const MyProjectGrid = ({ loading, projects, onOpen }) => {
  if (loading) {
    return (
      <div className="col-span-full">
        <LoadingSpinner fullPage message="Loading your projects..." />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="col-span-full py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-6">
        <div className="p-4 bg-gray-100 rounded-2xl mb-4">
          <Briefcase className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No projects yet
        </h3>
        <p className="text-gray-500 max-w-xs mb-8">
          You haven&apos;t registered any research projects. Start by creating
          your first project!
        </p>
        <Link
          href="/projects/create"
          className="px-8 py-3 bg-white border border-gray-200 text-amu-green font-bold rounded-xl hover:border-amu-green transition-all"
        >
          Start First Project
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {projects.map((project) => (
        <MyProjectCard key={project.id} project={project} onOpen={onOpen} />
      ))}
    </div>
  );
};

export default MyProjectGrid;
