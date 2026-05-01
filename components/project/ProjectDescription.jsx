import React from "react";
import { FlaskConical } from "lucide-react";
import { motion } from "framer-motion";

const ProjectDescription = ({ isEditing, description, onChange }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-white rounded-[3rem] p-10 lg:p-14 shadow-2xl shadow-gray-200/50 border border-gray-100"
  >
    <div className="flex items-center gap-3 mb-8">
      <div className="w-10 h-10 bg-amu-green/10 rounded-xl flex items-center justify-center">
        <FlaskConical className="h-5 w-5 text-amu-green" />
      </div>
      <h2 className="text-2xl font-black text-gray-900">Description</h2>
    </div>
    <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed">
      {isEditing ? (
        <textarea
          value={description}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 focus:outline-none focus:border-amu-green focus:bg-white transition-colors resize-none"
        />
      ) : (
        <p>{description}</p>
      )}
    </div>
  </motion.div>
);

export default ProjectDescription;
