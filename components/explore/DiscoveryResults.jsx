import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import ProjectGridCard from "./ProjectGridCard";
import UserGridCard from "./UserGridCard";

const DiscoveryResults = ({
  activeTab,
  results,
  isFiltering,
  onProjectClick,
  onUserClick,
}) => (
  <div className="relative min-h-[400px]">
    <AnimatePresence>
      {isFiltering && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-20 bg-white/40 backdrop-blur-[2px] flex items-center justify-center rounded-3xl"
        >
          <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
            <div className="w-12 h-12 border-4 border-amu-green/20 border-t-amu-green rounded-full animate-spin" />
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">
              Filtering Results...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AnimatePresence mode="popLayout">
        {results.length > 0 ? (
          results
            .filter((item) => item && item.id)
            .map((item) =>
              activeTab === "projects" ? (
                <ProjectGridCard
                  key={`p-${item.id}`}
                  project={item}
                  onClick={() => onProjectClick(item.projectID)}
                />
              ) : (
                <UserGridCard
                  key={`u-${item.id}`}
                  user={item}
                  onClick={() => onUserClick(item.id)}
                />
              ),
            )
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
              <Users className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              No Results Found
            </h3>
            <p className="text-gray-500 max-w-xs">
              Try adjusting your search or filters to find what you are looking
              for.
            </p>
          </div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

export default DiscoveryResults;
