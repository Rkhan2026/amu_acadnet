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
  Plus,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { AMU_DEPARTMENTS } from "@/lib/constants";

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
    biography: user.academicProfile?.biography || "",
    interestsSkills: user.academicProfile?.interestsSkills || [],
    profilePhoto: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag) {
        if (
          formData.interestsSkills.some(
            (t) => t.toLowerCase() === tag.toLowerCase(),
          )
        ) {
          toast.error(`${tag} is already added`);
          setTagInput("");
          return;
        }
        setFormData((prev) => ({
          ...prev,
          interestsSkills: [...prev.interestsSkills, tag],
        }));
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      interestsSkills: prev.interestsSkills.filter((t) => t !== tagToRemove),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
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

          <div className="space-y-4">
            <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amu-green" />
              Interests & Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-3 min-h-[40px] p-4 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
              {formData.interestsSkills.length > 0 ? (
                formData.interestsSkills.map((interest, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-amu-green font-bold text-xs rounded-xl border border-amu-green/20 shadow-sm group hover:border-amu-green/40 transition-all"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeTag(interest)}
                      className="p-1 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-gray-400 text-xs italic p-1">
                  No interests or skills added yet...
                </p>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-amu-green focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900 shadow-inner"
                placeholder="Type and press Enter to add interests & skills"
              />
              <button
                type="button"
                onClick={() => {
                  const tag = tagInput.trim();
                  if (tag) {
                    if (
                      formData.interestsSkills.some(
                        (t) => t.toLowerCase() === tag.toLowerCase(),
                      )
                    ) {
                      toast.error(`${tag} is already added`);
                      setTagInput("");
                      return;
                    }
                    setFormData((prev) => ({
                      ...prev,
                      interestsSkills: [...prev.interestsSkills, tag],
                    }));
                    setTagInput("");
                  }
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-amu-green text-white rounded-xl hover:bg-[#004d26] transition-colors shadow-lg shadow-amu-green/20"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1">
              Press Enter or Comma to add a tag
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
