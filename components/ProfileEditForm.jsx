"use client";
import React, { useState } from "react";
import {
  Save,
  X,
  User,
  Building2,
  BookText,
  Sparkles,
  UploadCloud,
  ExternalLink,
} from "lucide-react";

import { AMU_DEPARTMENTS } from "@/lib/utils";

const ProfileEditForm = ({
  user,
  onSave,
  onCancel,
  isSaving,
  externalError,
}) => {
  const [formData, setFormData] = useState({
    name: user.name,
    department: user.department,
    biography: user.biography,
    researchInterests: user.researchInterests,
    profilePhoto: "",
  });
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "researchInterests") {
      value = value.replace(/,/g, "");
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
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
              Interests
            </label>
            <input
              type="text"
              name="researchInterests"
              value={formData.researchInterests}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-amu-green focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900 shadow-inner"
              placeholder="e.g. Artificial Intelligence"
            />
            <p className="text-xs text-gray-400 font-medium">
              Enter your primary project domain
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">
            Profile Photo
          </label>
          <div className="flex gap-3 items-stretch">
            <div className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors relative cursor-pointer min-w-0">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center text-center gap-2 pointer-events-none p-2 overflow-hidden w-full">
                <UploadCloud className="h-6 w-6 text-gray-400 shrink-0" />
                {fileName ? (
                  <p className="text-xs font-mono font-semibold text-amu-green bg-green-50 px-3 py-1.5 rounded-lg truncate max-w-full border border-green-100">
                    {fileName}
                  </p>
                ) : (
                  <p className="text-xs font-bold text-gray-500">
                    Click or drag to upload (Max 5MB)
                  </p>
                )}
              </div>
            </div>
            {user?.profilePhoto &&
              user.profilePhoto !== "/default-avatar.svg" && (
                <a
                  href={user.profilePhoto}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 w-20 flex flex-col items-center justify-center gap-1.5 p-2 border border-gray-200 rounded-2xl bg-white hover:bg-green-50 hover:border-amu-green/30 transition-all group"
                  title="View Current Profile Photo"
                >
                  <div className="p-1.5 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                    <ExternalLink className="h-4 w-4 text-amu-green" />
                  </div>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center leading-tight">
                    View
                    <br />
                    Current
                  </span>
                </a>
              )}
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
          />
        </div>

        {externalError && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-medium text-sm">
            {externalError}
          </div>
        )}

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-amu-green text-white font-black rounded-2xl hover:bg-amu-green/90 transition-all shadow-xl shadow-amu-green/20 uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
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
