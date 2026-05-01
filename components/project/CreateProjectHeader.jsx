import React from "react";
import { PlusCircle } from "lucide-react";

const CreateProjectHeader = () => {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-amu-green/10 rounded-xl">
          <PlusCircle className="h-6 w-6 text-amu-green" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          Create New Project
        </h1>
      </div>
      <p className="text-gray-500 font-medium text-lg">
        Initialize your research project with institutional metadata defined in
        the project schema.
      </p>
    </div>
  );
};

export default CreateProjectHeader;
