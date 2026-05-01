import React from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchHero({ activeTab, searchValue, onSearchChange }) {
  return (
    <section className="relative h-96 rounded-4xl overflow-hidden flex flex-col items-center justify-center text-center p-8 bg-amu-green text-white shadow-2xl shadow-amu-green/20">
      <div className="absolute inset-0 bg-linear-to-tr from-amu-green via-amu-green to-amu-green-light opacity-50" />
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 space-y-4 max-w-3xl"
      >
        <h1 className="text-5xl font-black tracking-tight mb-2">
          Explore AMU Research Network
        </h1>
        <p className="text-amu-green-light font-medium text-xl opacity-90">
          Discover groundbreaking projects, domain experts, and collaborative
          opportunities within Aligarh Muslim University.
        </p>
        <div className="relative max-w-2xl mx-auto mt-10">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
          <input
            type="text"
            placeholder={
              activeTab === "projects"
                ? "Search by project title..."
                : "Search by person name..."
            }
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-white rounded-3xl text-gray-900 font-bold text-lg focus:outline-none focus:ring-8 focus:ring-white/10 transition-all placeholder:text-gray-400 shadow-2xl shadow-black/10"
          />
        </div>
      </motion.div>
    </section>
  );
}
