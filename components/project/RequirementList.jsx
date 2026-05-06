import React, { memo } from "react";
import { ListChecks } from "lucide-react";
import { motion } from "framer-motion";
import TagInput from "@/components/ui/TagInput";

const RequirementList = memo(
  ({ isEditing, requirements, onAdd, onRemove, inputValue, onInputChange }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-[3rem] p-10 lg:p-14 shadow-2xl shadow-gray-200/50 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amu-gold/10 rounded-xl flex items-center justify-center">
              <ListChecks className="h-5 w-5 text-amu-gold" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Requirements</h2>
          </div>
        </div>

        {isEditing ? (
          <TagInput
            tags={requirements}
            onAdd={onAdd}
            onRemove={onRemove}
            inputValue={inputValue}
            onInputChange={onInputChange}
            placeholder="Add skill (e.g. Python)"
          />
        ) : (
          <div className="flex flex-wrap gap-4">
            {requirements.map((req, i) => (
              <div
                key={i}
                className="group relative flex items-center gap-2 px-6 py-3 font-bold rounded-2xl border transition-all lowercase bg-gray-50 text-gray-700 border-gray-100 hover:border-amu-gold/30 hover:bg-white hover:shadow-md cursor-default"
              >
                {req}
              </div>
            ))}
            {requirements.length === 0 && (
              <p className="text-gray-400 font-medium italic">
                No requirements specified.
              </p>
            )}
          </div>
        )}
      </motion.div>
    );
  },
);

RequirementList.displayName = "RequirementList";
export default RequirementList;
