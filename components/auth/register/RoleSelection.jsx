import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const RoleSelection = ({ roles, formData, setFormData, errors }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-700 mb-4">
        Select your role in the university:
      </p>
      <div className="grid grid-cols-1 gap-4">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: role.id }))}
            className={cn(
              "flex items-center p-4 border-2 rounded-xl transition-all text-left group",
              formData.role === role.id
                ? "border-amu-green bg-green-50"
                : "border-gray-100 hover:border-amu-green/50 hover:bg-gray-50",
            )}
          >
            <div
              className={cn(
                "p-2 rounded-lg mr-4 transition-colors",
                formData.role === role.id
                  ? "bg-amu-green text-white"
                  : "bg-gray-100 text-gray-500 group-hover:bg-amu-green/10 group-hover:text-amu-green",
              )}
            >
              <role.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-gray-900">{role.label}</p>
              <p className="text-xs text-gray-500">{role.description}</p>
            </div>
            {formData.role === role.id && (
              <Check className="h-5 w-5 text-amu-green ml-auto" />
            )}
          </button>
        ))}
      </div>
      {errors.role && (
        <p className="text-red-500 text-sm mt-2">{errors.role}</p>
      )}
    </div>
  );
};

export default RoleSelection;
