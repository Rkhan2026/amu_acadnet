import React from "react";
import { cn, AMU_DEPARTMENTS } from "@/lib/utils";

const AcademicDetails = ({
  formData,
  handleInputChange,
  handleFileChange,
  errors,
  identityProofName,
  profilePhotoName,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Department
        </label>
        <select
          name="department"
          value={formData.department}
          onChange={handleInputChange}
          className={cn(
            "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all",
            errors.department ? "border-red-500" : "border-gray-300",
          )}
        >
          <option value="">Select Department</option>
          {AMU_DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        {errors.department && (
          <p className="text-red-500 text-sm mt-1">{errors.department}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {formData.role === "faculty"
            ? "Faculty ID"
            : "University ID (Enrollment Number)"}
        </label>
        <input
          type="text"
          name="universityID"
          value={formData.universityID}
          onChange={handleInputChange}
          className={cn(
            "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all",
            errors.universityID ? "border-red-500" : "border-gray-300",
          )}
          placeholder={formData.role === "faculty" ? "F12345" : "GH8981"}
        />
        {errors.universityID && (
          <p className="text-red-500 text-sm mt-1">{errors.universityID}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Identity Proof (JPG/PDF) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="file"
            name="identityProof"
            accept=".jpg,.jpeg,.pdf"
            onChange={(e) => handleFileChange(e, "identityProof")}
            className={cn(
              "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all text-gray-900",
              errors.identityProof ? "border-red-500" : "border-gray-300",
            )}
          />
          {identityProofName && (
            <p className="mt-1 text-xs font-bold text-amu-green">
              Selected: {identityProofName}
            </p>
          )}
        </div>
        <p className="mt-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Max 5MB allowed
        </p>
        {errors.identityProof && (
          <p className="text-red-500 text-sm mt-1">{errors.identityProof}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Profile Photo (Optional)
        </label>
        <div className="relative">
          <input
            type="file"
            name="profilePhoto"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "profilePhoto")}
            className={cn(
              "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all text-gray-900",
              errors.profilePhoto ? "border-red-500" : "border-gray-300",
            )}
          />
          {profilePhotoName && (
            <p className="mt-1 text-xs font-bold text-amu-green">
              Selected: {profilePhotoName}
            </p>
          )}
        </div>
        <p className="mt-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Max 5MB allowed
        </p>
        {errors.profilePhoto && (
          <p className="text-red-500 text-sm mt-1">{errors.profilePhoto}</p>
        )}
      </div>
    </div>
  );
};

export default AcademicDetails;
