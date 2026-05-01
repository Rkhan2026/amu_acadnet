import React from "react";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

const ProjectNotFound = ({ onBack }) => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
    <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
      <FileText className="h-10 w-10 text-red-400" />
    </div>
    <h1 className="text-3xl font-black text-gray-900 mb-2">
      Project Not Found
    </h1>
    <p className="text-gray-500 mb-8 max-w-sm">
      The research project you are looking for might have been moved or
      archived.
    </p>
    <Link
      href="/projects"
      onClick={onBack}
      className="px-8 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all flex items-center gap-2"
    >
      <ArrowLeft className="h-5 w-5" /> Go Back
    </Link>
  </div>
);

export default ProjectNotFound;
