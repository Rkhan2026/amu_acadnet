"use client";
import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { AMU_DEPARTMENTS } from "@/lib/utils";

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-12">
      {/* Search Header */}
      <section className="relative h-64 rounded-4xl overflow-hidden flex flex-col items-center justify-center text-center p-8 bg-amu-green text-white shadow-2xl shadow-amu-green/20">
        <div className="absolute inset-0 bg-linear-to-tr from-amu-green via-amu-green to-amu-green-light opacity-50" />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 space-y-4 max-w-2xl"
        >
          <h1 className="text-4xl font-black tracking-tight">
            Explore AMU Research Network
          </h1>
          <p className="text-amu-green-light font-medium text-lg">
            Discover groundbreaking projects, domain experts, and collaborative
            opportunities within Aligarh Muslim University.
          </p>
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by keywords, professor name, or research domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl text-gray-900 font-bold focus:outline-none focus:ring-4 focus:ring-white/20 transition-all placeholder:text-gray-300"
            />
          </div>
        </motion.div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar discovery (Left) */}
        <aside className="space-y-12">
          {/* Institutional Filters */}
          <section className="bg-amu-green/5 p-8 rounded-4xl border border-amu-green/10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amu-green/10 rounded-xl">
                <Filter className="h-5 w-5 text-amu-green" />
              </div>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                Filter By
              </h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Department
                </label>
                <select className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-amu-green/20 appearance-none">
                  <option value="">All Departments</option>
                  {AMU_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Research Domain
                </label>
                <select className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-amu-green/20 appearance-none">
                  <option>All Domains</option>
                  <option>Artificial Intelligence</option>
                  <option>Quantum Computing</option>
                  <option>Sustainable Energy</option>
                  <option>Biotechnology</option>
                  <option>Medieval History</option>
                </select>
              </div>
            </div>
            <button className="w-full py-4 bg-amu-green text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-amu-green/20 hover:scale-[1.02] transition-all active:scale-95">
              Apply Global Filters
            </button>
          </section>
        </aside>

        {/* Placeholder for future specific category discovery results (Right) */}
        <div className="lg:col-span-2 space-y-12 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-4xl min-h-100">
          <div className="text-center space-y-2">
            <Search className="h-10 w-10 text-gray-200 mx-auto" />
            <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">
              Use search or filters to begin discovery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
