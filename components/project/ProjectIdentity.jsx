import React from "react";
import { Rocket } from "lucide-react";

const ProjectIdentity = ({
  formData,
  handleChange,
  domains,
  statuses,
  showCustomDomain,
  setShowCustomDomain,
}) => (
  <div className="bg-white p-8 rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100 space-y-6">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
        <Rocket className="h-4 w-4 text-blue-500" />
      </div>
      <h2 className="text-lg font-black text-gray-900">Project Identity</h2>
    </div>

    <div className="space-y-4">
      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
          Project Title
        </label>
        <input
          type="text"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Exploring Neural Grafting in Localized Cognitive Centers"
          className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amu-green/20 focus:border-amu-green transition-all font-bold text-gray-900 placeholder:text-gray-300"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Project Domain
          </label>
          <div className="space-y-3">
            <select
              name="projectDomainSelect"
              required
              value={showCustomDomain ? "Other" : formData.projectDomain}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "Other") {
                  setShowCustomDomain(true);
                  handleChange({
                    target: { name: "projectDomain", value: "" },
                  });
                } else {
                  setShowCustomDomain(false);
                  handleChange({
                    target: { name: "projectDomain", value: val },
                  });
                }
              }}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amu-green/20 focus:border-amu-green transition-all font-bold text-gray-900 appearance-none"
            >
              <option value="">Select Project Domain</option>
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
              <option value="Other">Other (Custom Domain)</option>
            </select>

            {showCustomDomain && (
              <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
                <input
                  type="text"
                  name="projectDomain"
                  required
                  autoFocus
                  value={formData.projectDomain}
                  onChange={handleChange}
                  placeholder="Enter custom domain name..."
                  className="w-full px-5 py-4 bg-white border-2 border-amu-green/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amu-green/20 focus:border-amu-green transition-all font-bold text-gray-900 placeholder:text-gray-300"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-amu-green uppercase tracking-widest bg-amu-green/5 px-2 py-1 rounded-md">
                  Custom
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Current Status
          </label>
          <select
            name="projectStatus"
            required
            value={formData.projectStatus}
            onChange={handleChange}
            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amu-green/20 focus:border-amu-green transition-all font-bold text-gray-900 appearance-none"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  </div>
);

export default ProjectIdentity;
