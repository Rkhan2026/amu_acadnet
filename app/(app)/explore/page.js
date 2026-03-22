"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  Users,
  BookOpen,
  ArrowRight,
  Sparkles,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AMU_DEPARTMENTS } from "@/lib/utils";
import LoadingSpinner from "@/components/LoadingSpinner";
const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("projects");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");

  const [projectsData, setProjectsData] = useState([]);
  const [researchersData, setResearchersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingStatuses, setFollowingStatuses] = useState({});

  React.useEffect(() => {
    Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/users").then((r) => r.json()),
      fetch("/api/network").then((r) => r.json()),
    ])
      .then(([pData, rData, nData]) => {
        if (Array.isArray(pData))
          setProjectsData(
            pData
              .filter((p) => p.moderationStatus === "APPROVED")
              .map((p) => ({
                ...p,
                id: p.projectID,
                department: p.creator?.department || "General",
                leadResearcher: p.creator?.name || "Unknown",
                avatar: "/default-avatar.svg",
              })),
          );
        if (Array.isArray(rData))
          setResearchersData(
            rData.map((u) => ({
              id: u.universityID,
              name: u.name,
              role: u.role,
              department: u.department,
              interests: [], // To be fetched or fallback
              domain: u.department,
              avatar: "/default-avatar.svg",
            })),
          );
        if (!nData.error && nData.following) {
          const statuses = {};
          nData.following.forEach((f) => {
            statuses[f.followingID] = f.requestStatus;
          });
          setFollowingStatuses(statuses);
        }
      })
      .catch((_e) => console.error(_e))
      .finally(() => setLoading(false));
  }, []);

  const handleFollow = async (tid) => {
    try {
      const res = await fetch("/api/network/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetID: tid }),
      });
      if (res.ok) {
        setFollowingStatuses((prev) => ({ ...prev, [tid]: "PENDING" }));
      } else {
        const err = await res.json();
        alert(err.error || "Follow failed");
      }
    } catch (_e) {
      alert("Something went wrong");
    }
  };

  const filteredProjects = useMemo(() => {
    return projectsData.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = !selectedDept || p.department === selectedDept;
      const matchesDomain =
        !selectedDomain || p.researchDomain === selectedDomain;
      return matchesSearch && matchesDept && matchesDomain;
    });
  }, [searchQuery, selectedDept, selectedDomain, projectsData]);

  const filteredResearchers = useMemo(() => {
    return researchersData.filter((r) => {
      const matchesSearch = r.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDept = !selectedDept || r.department === selectedDept;
      const matchesDomain = !selectedDomain || r.domain === selectedDomain;
      return matchesSearch && matchesDept && matchesDomain;
    });
  }, [searchQuery, selectedDept, selectedDomain, researchersData]);

  const results =
    activeTab === "projects" ? filteredProjects : filteredResearchers;

  return (
    <div className="max-w-7xl mx-auto py-4 px-6 space-y-8">
      {/* Search Header */}
      <section className="relative h-64 rounded-4xl overflow-hidden flex flex-col items-center justify-center text-center p-8 bg-amu-green text-white shadow-2xl shadow-amu-green/20">
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
              placeholder="Search by researcher name, or project title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-white rounded-3xl text-gray-900 font-bold text-lg focus:outline-none focus:ring-8 focus:ring-white/10 transition-all placeholder:text-gray-400 shadow-2xl shadow-black/10"
            />
          </div>
        </motion.div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters (Left) */}
        <aside className="lg:col-span-1 space-y-6">
          <section className="bg-white p-6 rounded-4xl border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
              <div className="p-2 bg-amu-green/10 rounded-xl">
                <Filter className="h-5 w-5 text-amu-green" />
              </div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">
                Filters
              </h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                  Department
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-amu-green focus:bg-white rounded-2xl text-sm font-bold text-gray-700 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Departments</option>
                  {AMU_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                  Research Domain
                </label>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-amu-green focus:bg-white rounded-2xl text-sm font-bold text-gray-700 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Domains</option>
                  <option value="Artificial Intelligence">AI</option>
                  <option value="Quantum Physics">Quantum Computing</option>
                  <option value="Sustainability">Sustainable Energy</option>
                  <option value="Biology">Biotechnology</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedDept("");
                setSelectedDomain("");
                setSearchQuery("");
              }}
              className="w-full py-4 text-gray-400 hover:text-gray-600 font-bold text-xs uppercase tracking-widest transition-colors"
            >
              Clear all filters
            </button>
          </section>
        </aside>

        {/* Results Area (Right) */}
        <main className="lg:col-span-3 space-y-6">
          {loading ? (
            <LoadingSpinner fullPage message="Searching discovery results..." />
          ) : (
            <>
              {/* Tabs */}
              <div className="flex items-center gap-2 p-1.5 bg-gray-100/50 rounded-2xl w-fit">
                <button
                  onClick={() => setActiveTab("projects")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${
                    activeTab === "projects"
                      ? "bg-white text-amu-green shadow-md"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  Projects
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-[10px] rounded-md">
                    {filteredProjects.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("researchers")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${
                    activeTab === "researchers"
                      ? "bg-white text-amu-green shadow-md"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Researchers
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-[10px] rounded-md">
                    {filteredResearchers.length}
                  </span>
                </button>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="wait">
                  {results.length > 0 ? (
                    results
                      .filter((item) => item && item.id)
                      .map((item, idx) => (
                        <motion.div
                          key={activeTab === "projects" ? item.id : item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: idx * 0.05 }}
                          className="group bg-white p-6 rounded-3xl border border-gray-100 hover:border-amu-green/30 transition-all hover:shadow-2xl hover:shadow-gray-200/50 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between mb-4">
                              <div
                                className={`p-3 rounded-2xl ${activeTab === "projects" ? "bg-amu-gold/10 text-amu-gold" : "bg-blue-50 text-blue-500"}`}
                              >
                                {activeTab === "projects" ? (
                                  <BookOpen className="h-6 w-6" />
                                ) : (
                                  <Users className="h-6 w-6" />
                                )}
                              </div>
                              {activeTab === "projects" && (
                                <span className="px-3 py-1 bg-amu-green/5 text-amu-green text-[10px] font-black uppercase tracking-widest rounded-full">
                                  {item.projectStatus}
                                </span>
                              )}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amu-green transition-colors">
                              {activeTab === "projects"
                                ? item.title
                                : item.name}
                            </h3>

                            <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2 mb-6 text-balance">
                              {activeTab === "projects"
                                ? item.description
                                : `Expertise in ${item.interests.join(", ")}`}
                            </p>

                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-tighter">
                                <Building2 className="h-4 w-4 shrink-0" />
                                <span className="truncate">
                                  {item.department}
                                </span>
                              </div>
                              {activeTab === "researchers" && (
                                <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-tighter">
                                  <Sparkles className="h-4 w-4 shrink-0" />
                                  <span>{item.role}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Image
                                src={item.avatar}
                                alt=""
                                width={32}
                                height={32}
                                className="h-8 w-8 rounded-full border border-gray-100"
                              />
                              <span className="text-xs font-black text-gray-700">
                                {activeTab === "projects"
                                  ? item.leadResearcher
                                  : item.domain}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {activeTab === "researchers" &&
                                !followingStatuses[item.id] && (
                                  <button
                                    onClick={() => handleFollow(item.id)}
                                    className="px-4 py-2 bg-amu-green/10 text-amu-green text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-amu-green hover:text-white transition-all shadow-sm"
                                  >
                                    Follow
                                  </button>
                                )}
                              {activeTab === "researchers" &&
                                followingStatuses[item.id] && (
                                  <span
                                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border ${
                                      followingStatuses[item.id] === "ACCEPTED"
                                        ? "bg-amu-green/10 text-amu-green border-amu-green/20"
                                        : "bg-gray-100 text-gray-400 border-gray-200"
                                    }`}
                                  >
                                    {followingStatuses[item.id] === "ACCEPTED"
                                      ? "Following"
                                      : "Requested"}
                                  </span>
                                )}
                              <Link
                                href={
                                  activeTab === "projects"
                                    ? `/projects/${item.projectID}`
                                    : `/profile/${item.id}`
                                }
                                className="p-2 bg-gray-50 text-gray-400 group-hover:bg-amu-green group-hover:text-white rounded-xl transition-all"
                              >
                                <ArrowRight className="h-5 w-5" />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                      <div className="p-6 bg-gray-100 rounded-full mb-6">
                        <Search className="h-12 w-12 text-gray-300" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-300 uppercase tracking-widest">
                        No results found
                      </h3>
                      <p className="text-gray-400 font-medium mt-2">
                        Adjust your filters or try a different search term.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ExplorePage;
