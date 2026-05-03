import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ResearchProfile = ({
  formData,
  handleInputChange,
  interests,
  interestInput,
  setInterestInput,
  addInterest,
  removeInterest,
  errors,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Interests & Skills
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {interests.map((interest, index) => (
            <span
              key={index}
              className="flex items-center gap-1.5 px-3 py-1 bg-amu-green/10 text-amu-green rounded-full text-xs font-bold border border-amu-green/20 animate-in zoom-in duration-300"
            >
              {interest}
              <button
                type="button"
                onClick={() => removeInterest(index)}
                className="hover:text-amu-green/70 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addInterest();
              }
            }}
            className={cn(
              "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all pr-20",
              errors.domain ? "border-red-500" : "border-gray-300",
            )}
            placeholder="Type and press Enter..."
          />
          <button
            type="button"
            onClick={addInterest}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-md hover:bg-amu-green hover:text-white transition-all"
          >
            Add
          </button>
        </div>
        {errors.domain && (
          <p className="text-red-500 text-sm mt-1">{errors.domain}</p>
        )}
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Add as many interests & skills as you want
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Biography
        </label>
        <textarea
          name="biography"
          value={formData.biography}
          onChange={handleInputChange}
          rows={5}
          className={cn(
            "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all",
            errors.biography ? "border-red-500" : "border-gray-300",
          )}
          placeholder="Tell us about your academic background..."
        />
        {errors.biography && (
          <p className="text-red-500 text-sm mt-1">{errors.biography}</p>
        )}
      </div>
    </div>
  );
};

export default ResearchProfile;
