import React, { useState } from "react";
import { Plus, X } from "lucide-react";

const RequirementsInput = ({ requirements, setRequirements }) => {
  const [newRequirement, setNewRequirement] = useState("");

  const addReq = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim().toLowerCase()]);
      setNewRequirement("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between ml-1">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Requirements
        </label>
        <span className="text-[10px] text-gray-300 font-bold italic">
          Press Enter to add
        </span>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="e.g. Python, Deep Learning, Pytorch"
          value={newRequirement}
          onChange={(e) => setNewRequirement(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addReq();
            }
          }}
          className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amu-green/20 focus:border-amu-green transition-all font-bold text-gray-900 placeholder:text-gray-300"
        />
        <button
          type="button"
          onClick={addReq}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-amu-green/10 text-amu-green rounded-xl hover:bg-amu-green/20 transition-all"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {requirements.map((req, i) => (
          <div
            key={i}
            className="group flex items-center gap-2 px-4 py-2 bg-amu-green/5 text-amu-green border border-amu-green/10 rounded-xl text-xs font-bold transition-all hover:border-amu-green/30 lowercase"
          >
            {req}
            <button
              type="button"
              onClick={() => {
                setRequirements(requirements.filter((_, idx) => idx !== i));
              }}
              className="p-1 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {requirements.length === 0 && (
          <p className="text-[10px] text-gray-300 italic ml-1">
            No requirements added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default RequirementsInput;
