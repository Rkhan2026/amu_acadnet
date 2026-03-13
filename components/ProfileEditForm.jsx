"use client";
import React, { useState } from "react";
import { Save, X, User, Building2, BookText, Sparkles } from "lucide-react";

import { AMU_DEPARTMENTS } from "@/lib/utils";

const ProfileEditForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    department: user.department,
    biography: user.biography,
    researchInterests: user.researchInterests,
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "researchInterests") {
      value = value.replace(/,/g, "");
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-4xl p-8 lg:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100 animate-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Edit Academic Profile
          </h2>
          <p className="text-gray-500 font-medium mt-1">
            Update your professional information and research focus.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-3 bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
              <User className="h-4 w-4 text-amu-green" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-amu-green focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900 shadow-inner"
              placeholder="e.g. Dr. Sarah Ahmed"
              required
            />
          </div>

          <div className="space-y-2 relative">
            <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
              <Building2 className="h-4 w-4 text-amu-green" />
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-amu-green focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900 shadow-inner appearance-none cursor-pointer"
              required
            >
              <option value="">Select Department</option>
              {AMU_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 mt-3 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amu-green" />
              Research Interests
            </label>
            <input
              type="text"
              name="researchInterests"
              value={formData.researchInterests}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-amu-green focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900 shadow-inner"
              placeholder="e.g. Artificial Intelligence"
              required
            />
            <p className="text-xs text-gray-400 font-medium">
              Enter your primary research domain
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
            <BookText className="h-4 w-4 text-amu-green" />
            Biography
          </label>
          <textarea
            name="biography"
            value={formData.biography}
            onChange={handleChange}
            rows={4}
            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-amu-green focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900 shadow-inner resize-none"
            placeholder="Tell us about your academic journey..."
            required
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-amu-green text-white font-black rounded-2xl hover:bg-amu-green/90 transition-all shadow-xl shadow-amu-green/20 uppercase tracking-widest"
          >
            <Save className="h-5 w-5" />
            Save Changes
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 md:flex-none px-10 py-4 bg-gray-50 text-gray-500 font-black rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;
