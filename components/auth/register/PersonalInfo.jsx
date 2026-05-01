import React from "react";
import { cn } from "@/lib/utils";

const PersonalInfo = ({ formData, handleInputChange, errors }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={cn(
            "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all",
            errors.name ? "border-red-500" : "border-gray-300",
          )}
          placeholder="e.g. Dr. Sarah Ahmed"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={cn(
            "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all",
            errors.email ? "border-red-500" : "border-gray-300",
          )}
          placeholder="name@email.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={cn(
              "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all",
              errors.password ? "border-red-500" : "border-gray-300",
            )}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={cn(
              "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all",
              errors.confirmPassword ? "border-red-500" : "border-gray-300",
            )}
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
