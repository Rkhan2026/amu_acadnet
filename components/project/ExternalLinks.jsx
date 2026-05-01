import React, { memo } from "react";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const ExternalLinks = memo(
  ({ isEditing, links, onAdd, onRemove, onChange }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-50 rounded-[3rem] p-10 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
            <ExternalLink className="h-5 w-5 text-amu-green" />
            External Links
          </h3>
          {isEditing && (
            <button
              onClick={onAdd}
              className="p-2 bg-white text-amu-green rounded-xl border border-gray-200 hover:border-amu-green transition-all"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          {isEditing ? (
            links.map((link, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={typeof link === "string" ? link : link.url || ""}
                  onChange={(e) => onChange(i, e.target.value)}
                  placeholder="https://"
                  className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-amu-green"
                />
                <button
                  onClick={() => onRemove(i)}
                  className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {links.map((link, i) => (
                <a
                  key={i}
                  href={typeof link === "string" ? link : link.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center justify-center group hover:border-amu-green transition-all shadow-sm overflow-hidden"
                >
                  <p className="text-gray-500 group-hover:text-amu-green transition-colors truncate text-sm font-medium">
                    {typeof link === "string" ? link : link.url}
                  </p>
                </a>
              ))}
              {links.length === 0 && (
                <p className="col-span-full text-center text-gray-400 font-medium italic py-4">
                  No external links provided.
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  },
);

ExternalLinks.displayName = "ExternalLinks";
export default ExternalLinks;
