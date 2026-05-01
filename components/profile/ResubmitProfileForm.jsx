import React from "react";
import {
  User,
  Mail,
  GraduationCap,
  IdCard,
  Building2,
  BookOpen,
} from "lucide-react";
import { AMU_DEPARTMENTS } from "@/lib/utils";
import FileUpload from "./FileUpload";

const ResubmitProfileForm = ({
  formData,
  setFormData,
  fileNames,
  handleFileChange,
  user,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all"
            />
          </div>
        </div>

        {/* Role */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Role
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <GraduationCap className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all appearance-none"
            >
              <option value="" disabled>
                Select your role
              </option>
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty</option>
              <option value="RESEARCH SCHOLAR">Research Scholar</option>
            </select>
          </div>
        </div>

        {/* University ID */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            University ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <IdCard className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="universityID"
              value={formData.universityID}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all"
            />
          </div>
        </div>

        {/* Department */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Department
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all appearance-none"
            >
              <option value="" disabled>
                Select your department
              </option>
              {AMU_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Biography */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
          Biography
        </label>
        <textarea
          name="biography"
          rows={4}
          value={formData.biography}
          onChange={handleChange}
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all"
          placeholder="Briefly describe your academic background and goals..."
        />
      </div>

      {/* Interests */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
          Interests
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <BookOpen className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="researchInterests"
            value={formData.researchInterests}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all"
            placeholder="e.g. Machine Learning, NLP, Computer Vision (comma separated)"
          />
        </div>
      </div>

      {/* File Uploads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileUpload
          label="Profile Photo"
          fileName={fileNames.profilePhoto}
          currentFileUrl={user?.profilePhoto}
          onFileChange={(e) => handleFileChange(e, "profilePhoto")}
        />
        <FileUpload
          label="Identity Proof"
          fileName={fileNames.identityProof}
          currentFileUrl={user?.identityProof}
          onFileChange={(e) => handleFileChange(e, "identityProof")}
        />
      </div>
    </div>
  );
};

export default ResubmitProfileForm;
