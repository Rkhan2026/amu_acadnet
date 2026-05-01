import React from "react";
import { Info } from "lucide-react";
import RequirementsInput from "./RequirementsInput";
import ExternalLinksInput from "./ExternalLinksInput";

const ProjectSpecifics = ({ formData, handleChange, setFormData }) => (
  <div className="bg-white p-8 rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100 space-y-6">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
        <Info className="h-4 w-4 text-purple-500" />
      </div>
      <h2 className="text-lg font-black text-gray-900">Project Specifics</h2>
    </div>

    <div className="space-y-6">
      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
          Description
        </label>
        <textarea
          name="description"
          required
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Briefly describe the research goals and methodology..."
          className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amu-green/20 focus:border-amu-green transition-all font-medium text-gray-600 placeholder:text-gray-300 resize-none"
        />
      </div>

      <RequirementsInput
        requirements={formData.requirements}
        setRequirements={(reqs) =>
          setFormData((prev) => ({ ...prev, requirements: reqs }))
        }
      />

      <ExternalLinksInput
        links={formData.externalLinks}
        setLinks={(links) =>
          setFormData((prev) => ({ ...prev, externalLinks: links }))
        }
      />
    </div>
  </div>
);

export default ProjectSpecifics;
