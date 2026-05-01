import React from "react";
import { PlusCircle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

const CreateProjectActions = ({ isSubmitting, onCancel }) => {
  return (
    <div className="flex items-center gap-4 pt-4">
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 bg-amu-green text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-amu-green/20 flex items-center justify-center gap-3 hover:bg-amu-green/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Initializing Project...
          </>
        ) : (
          <>
            <PlusCircle className="h-5 w-5" /> Register Research Project{" "}
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
      <Link
        href="/projects"
        onClick={onCancel}
        className="px-10 bg-gray-100 text-gray-400 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-200 hover:text-gray-600 transition-all flex items-center justify-center"
      >
        Cancel
      </Link>
    </div>
  );
};

export default CreateProjectActions;
