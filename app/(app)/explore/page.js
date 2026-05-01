"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

import {
  Search,
  Filter,
  Users,
  BookOpen,
  ArrowRight,
  Sparkles,
  Building2,
  ChevronRight,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AMU_DEPARTMENTS } from "@/lib/utils";
import LoadingSpinner from "@/components/LoadingSpinner";
import UserProfileModal from "@/components/UserProfileModal";
import ProjectModal from "@/components/ProjectModal";

const ExplorePage = () => {
  const [projectSearch, setProjectSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const activeTab = useMemo(() => {
    return tabParam === "users" ? "users" : "projects";
  }, [tabParam]);

  const setActiveTab = (tab) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const [projectDept, setProjectDept] = useState("");
  const [userDept, setUserDept] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [interestInput, setInterestInput] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [projectsData, setProjectsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [selectedProjectID, setSelectedProjectID] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [matchingProjectID, setMatchingProjectID] = useState("");
  const [isFilteringProjects, setIsFilteringProjects] = useState(false);
  const [isFilteringUsers, setIsFilteringUsers] = useState(false);

  // Removed useEffect syncing activeTab as it is now derived from URL

  const openProfile = (uid) => {
    setSelectedUserID(uid);
    setIsUserModalOpen(true);
  };

  const openProject = (pid) => {
    setSelectedProjectID(pid);
    setIsProjectModalOpen(true);
  };

  useEffect(() => {
    let usersUrl = "/api/users?all=true";
    // We handle interest filtering client-side for better UX with 'tag-like' behavior

    Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch(usersUrl).then((r) => r.json()),
      fetch("/api/auth/me").then((r) => r.json()),
    ])
      .then(([pData, rData, authData]) => {
        if (authData && authData.user) {
          setCurrentUser(authData.user);
          // Fetch my projects specifically
          fetch(`/api/projects?universityID=${authData.user.universityID}`)
            .then((r) => r.json())
            .then((myProjs) => {
              if (Array.isArray(myProjs)) setMyProjects(myProjs);
            });
        }
        if (Array.isArray(pData))
          setProjectsData(
            pData
              .filter((p) => p.moderationStatus === "APPROVED")
              .map((p) => ({
                ...p,
                id: p.projectID,
                department: p.creator?.department || "General",
                projectCreator: p.creator?.name || "Unknown",
                avatar: p.creator?.profilePhoto || "/default-avatar.svg",
              })),
          );
        if (Array.isArray(rData))
          setUsersData(
            rData.map((u) => ({
              id: u.universityID,
              name: u.name,
              role: u.role,
              department: u.department,
              interests: u.academicProfile?.researchInterests
                ? u.academicProfile.researchInterests
                    .split(",")
                    .map((s) => s.trim().toLowerCase())
                : [],
              domain: u.department,
              avatar: u.profilePhoto || "/default-avatar.svg",
              projectCount:
                (u._count?.createdProjects || 0) +
                (u._count?.workingProjects || 0),
            })),
          );
      })
      .catch((_e) => console.error(_e))
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = useMemo(() => {
    return projectsData.filter((p) => {
      const searchStr = projectSearch.trim().toLowerCase();
      const matchesSearch =
        (p.title || "").toLowerCase().includes(searchStr) ||
        (p.description || "").toLowerCase().includes(searchStr);

      const matchesDept = !projectDept || p.department === projectDept;
      const domainSearchStr = selectedDomain.trim().toLowerCase();
      const matchesDomain =
        !selectedDomain ||
        (p.projectDomain || "").toLowerCase().includes(domainSearchStr);

      // New Skill Filtering logic
      let matchesSkills = true;
      if (selectedSkills.length > 0) {
        const pReqs = (p.requirements || []).map((r) => r.toLowerCase());
        matchesSkills = selectedSkills.every((skill) =>
          pReqs.some((req) => req.includes(skill.toLowerCase())),
        );
      }

      return matchesSearch && matchesDept && matchesDomain && matchesSkills;
    });
  }, [
    projectSearch,
    projectDept,
    selectedDomain,
    projectsData,
    selectedSkills,
  ]);

  const filteredUsers = useMemo(() => {
    const matchingProject = matchingProjectID
      ? myProjects.find((p) => p.projectID === matchingProjectID)
      : null;
    const projectReqs = matchingProject?.requirements || [];

    const processedUsers = usersData.map((u) => {
      const searchStr = userSearch.trim().toLowerCase();
      const matchesSearch = (u.name || "").toLowerCase().includes(searchStr);
      const matchesDept = !userDept || u.department === userDept;

      let matchesInterests = true;
      let matchedSkills = [];

      // If matching with a project, we use those requirements as search terms
      const searchTerms = matchingProjectID
        ? projectReqs
        : selectedInterests.map((s) => s.trim().toLowerCase());

      if (searchTerms.length > 0) {
        matchedSkills = u.interests.filter((interest) =>
          searchTerms.some((term) => interest.toLowerCase().includes(term)),
        );
        matchesInterests = matchedSkills.length > 0;
      }

      // Calculate match score
      let matchScore = 0;
      if (searchTerms.length > 0) {
        // For project matching, we care about how many project requirements are met
        // For manual search, we care about how many search terms are met
        const denominator = matchingProjectID
          ? projectReqs.length
          : searchTerms.length;
        matchScore = (matchedSkills.length / (denominator || 1)) * 100;
      }

      return {
        ...u,
        matchesSearch,
        matchesDept,
        matchesInterests,
        matchedSkills,
        matchScore,
        totalReqs: matchingProjectID ? projectReqs.length : searchTerms.length,
      };
    });

    return processedUsers
      .filter((u) => u.matchesSearch && u.matchesDept && u.matchesInterests)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [
    userSearch,
    userDept,
    selectedInterests,
    usersData,
    matchingProjectID,
    myProjects,
  ]);

  // Effects to simulate filtering state for UX
  useEffect(() => {
    const timer = setTimeout(() => setIsFilteringProjects(false), 300);
    return () => clearTimeout(timer);
  }, [projectSearch, projectDept, selectedDomain, selectedSkills]);

  useEffect(() => {
    const timer = setTimeout(() => setIsFilteringUsers(false), 300);
    return () => clearTimeout(timer);
  }, [userSearch, userDept, selectedInterests, matchingProjectID]);

  const results = activeTab === "projects" ? filteredProjects : filteredUsers;

  return (
    <div className="max-w-7xl mx-auto py-4 px-6 space-y-8">
      {/* Search Header */}
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
              value={activeTab === "projects" ? projectSearch : userSearch}
              onChange={(e) => {
                if (activeTab === "projects") {
                  setProjectSearch(e.target.value);
                  setIsFilteringProjects(true);
                } else {
                  setUserSearch(e.target.value);
                  setIsFilteringUsers(true);
                }
              }}
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
                  value={activeTab === "projects" ? projectDept : userDept}
                  onChange={(e) => {
                    if (activeTab === "projects") {
                      setProjectDept(e.target.value);
                      setIsFilteringProjects(true);
                    } else {
                      setUserDept(e.target.value);
                      setIsFilteringUsers(true);
                    }
                  }}
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

              {activeTab === "projects" && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                    Project Domain
                  </label>
                  <div className="space-y-3">
                    <select
                      value={isCustomDomain ? "Other" : selectedDomain}
                      onChange={(e) => {
                        const val = e.target.value;
                        setIsFilteringProjects(true);
                        if (val === "Other") {
                          setIsCustomDomain(true);
                          setSelectedDomain("");
                        } else {
                          setIsCustomDomain(false);
                          setSelectedDomain(val);
                        }
                      }}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-amu-green focus:bg-white rounded-2xl text-sm font-bold text-gray-700 outline-none transition-all appearance-none cursor-pointer shadow-inner"
                    >
                      <option value="">Select Project Domain</option>
                      {[
                        "Artificial Intelligence",
                        "Social Sciences",
                        "Physics",
                        "Sustainable Development",
                        "Medieval History",
                        "Computer Science",
                        "Law",
                        "Biotechnology",
                      ].map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                      <option value="Other">Other (Custom Domain)</option>
                    </select>

                    {isCustomDomain && (
                      <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
                        <input
                          type="text"
                          placeholder="Search...."
                          value={selectedDomain}
                          onChange={(e) => {
                            setSelectedDomain(e.target.value);
                            setIsFilteringProjects(true);
                          }}
                          className="w-full pl-5 pr-[120px] py-4 bg-white border-2 border-amu-green/20 rounded-2xl text-sm font-bold text-gray-700 outline-none transition-all placeholder:text-gray-400"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-amu-green uppercase tracking-widest bg-amu-green/5 px-2 py-1 rounded-md pointer-events-none">
                          Search
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-50">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                      Required Skills
                    </label>
                    <div className="flex flex-wrap gap-2 min-h-[44px] p-2 bg-gray-50 border-2 border-transparent focus-within:border-amu-green focus-within:bg-white rounded-2xl transition-all">
                      {selectedSkills.map((tag, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1 px-3 py-1 bg-amu-green text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm animate-in zoom-in-95 duration-200"
                        >
                          {tag}
                          <button
                            onClick={() => {
                              setSelectedSkills(
                                selectedSkills.filter((_, i) => i !== idx),
                              );
                              setIsFilteringProjects(true);
                            }}
                            className="p-0.5 hover:bg-white/20 rounded-full transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder={
                          selectedSkills.length === 0
                            ? "e.g. Python, AI..."
                            : "Add skill..."
                        }
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            const val = skillInput.trim();
                            if (
                              val &&
                              !selectedSkills.includes(val.toLowerCase())
                            ) {
                              setSelectedSkills([
                                ...selectedSkills,
                                val.toLowerCase(),
                              ]);
                              setSkillInput("");
                              setIsFilteringProjects(true);
                            }
                          } else if (
                            e.key === "Backspace" &&
                            !skillInput &&
                            selectedSkills.length > 0
                          ) {
                            setSelectedSkills(selectedSkills.slice(0, -1));
                            setIsFilteringProjects(true);
                          }
                        }}
                        className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-gray-700 min-w-[100px] px-2 py-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "users" && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                    Interests
                  </label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2 min-h-[44px] p-2 bg-gray-50 border-2 border-transparent focus-within:border-amu-green focus-within:bg-white rounded-2xl transition-all">
                      {selectedInterests.map((tag, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1 px-3 py-1 bg-amu-green text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm animate-in zoom-in-95 duration-200"
                        >
                          {tag}
                          <button
                            onClick={() => {
                              setSelectedInterests(
                                selectedInterests.filter((_, i) => i !== idx),
                              );
                              setIsFilteringUsers(true);
                            }}
                            className="p-0.5 hover:bg-white/20 rounded-full transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder={
                          selectedInterests.length === 0
                            ? "e.g. ML, Physics..."
                            : "Add more..."
                        }
                        value={interestInput}
                        onChange={(e) => setInterestInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            const val = interestInput.trim();
                            if (
                              val &&
                              !selectedInterests.includes(val.toLowerCase())
                            ) {
                              setSelectedInterests([
                                ...selectedInterests,
                                val.toLowerCase(),
                              ]);
                              setInterestInput("");
                              setMatchingProjectID("");
                              setIsFilteringUsers(true);
                            }
                          } else if (
                            e.key === "Backspace" &&
                            !interestInput &&
                            selectedInterests.length > 0
                          ) {
                            setSelectedInterests(
                              selectedInterests.slice(0, -1),
                            );
                            setIsFilteringUsers(true);
                          }
                        }}
                        className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-gray-700 min-w-[120px] px-2 py-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "users" &&
                currentUser &&
                myProjects.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-gray-50">
                    <label className="text-[10px] font-black text-amu-green uppercase tracking-[0.2em] ml-1">
                      Match My Project
                    </label>
                    <select
                      value={matchingProjectID}
                      onChange={(e) => {
                        setMatchingProjectID(e.target.value);
                        setSelectedInterests(""); // Clear manual search if project selected
                        setIsFilteringUsers(true);
                      }}
                      className="w-full px-5 py-4 bg-amu-green/5 border-2 border-amu-green/20 focus:border-amu-green focus:bg-white rounded-2xl text-sm font-bold text-amu-green outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select your project...</option>
                      {myProjects.map((p) => (
                        <option key={p.projectID} value={p.projectID}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-gray-400 italic px-1">
                      Find users with required skills
                    </p>
                  </div>
                )}

              {activeTab === "users" && !currentUser && (
                <div className="space-y-3 pt-4 border-t border-gray-50">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                    Match My Project
                  </label>
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-400 hover:border-amu-green hover:text-amu-green transition-all text-left flex items-center justify-between group"
                  >
                    Login to match...
                    <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (activeTab === "projects") {
                  setProjectDept("");
                  setProjectSearch("");
                  setSelectedDomain("");
                  setIsCustomDomain(false);
                  setSelectedSkills([]);
                  setSkillInput("");
                } else {
                  setUserDept("");
                  setUserSearch("");
                  setSelectedInterests([]);
                  setInterestInput("");
                  setMatchingProjectID("");
                }
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
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-[10px] rounded-md min-w-[20px] flex items-center justify-center h-5">
                    {activeTab === "projects" && isFilteringProjects ? (
                      <div className="w-2 h-2 border-2 border-amu-green/30 border-t-amu-green rounded-full animate-spin" />
                    ) : (
                      filteredProjects.length
                    )}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${
                    activeTab === "users"
                      ? "bg-white text-amu-green shadow-md"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Users
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-[10px] rounded-md min-w-[20px] flex items-center justify-center h-5">
                    {activeTab === "users" && isFilteringUsers ? (
                      <div className="w-2 h-2 border-2 border-amu-green/30 border-t-amu-green rounded-full animate-spin" />
                    ) : (
                      filteredUsers.length
                    )}
                  </span>
                </button>
              </div>

              {/* Results Grid */}
              <div className="relative min-h-[400px]">
                <AnimatePresence>
                  {(activeTab === "projects"
                    ? isFilteringProjects
                    : isFilteringUsers) && (
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
                        .map((item, idx) => (
                          <motion.div
                            key={
                              activeTab === "projects"
                                ? `p-${item.id}`
                                : `u-${item.id}`
                            }
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() =>
                              activeTab === "projects"
                                ? openProject(item.projectID)
                                : openProfile(item.id)
                            }
                            className="group bg-white p-6 rounded-3xl border border-gray-100 hover:border-amu-green/30 transition-all hover:shadow-2xl hover:shadow-gray-200/50 flex flex-col justify-between cursor-pointer"
                          >
                            <div>
                              <div className="flex items-start justify-between mb-4">
                                <div
                                  className={`relative h-12 w-12 rounded-2xl overflow-hidden flex items-center justify-center ${activeTab === "projects" ? "bg-amu-gold/10 text-amu-gold" : "bg-blue-50 text-blue-500"}`}
                                >
                                  {activeTab === "projects" ? (
                                    <BookOpen className="h-6 w-6" />
                                  ) : item.avatar &&
                                    item.avatar !== "/default-avatar.svg" ? (
                                    <Image
                                      src={
                                        item.avatar.match(/\.[a-zA-Z0-9]+$/)
                                          ? item.avatar
                                          : `${item.avatar}.jpg`
                                      }
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                    />
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

                              <div className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
                                {activeTab === "projects" ? (
                                  <div className="space-y-4">
                                    <p className="line-clamp-2">
                                      {item.description}
                                    </p>
                                    {item.requirements &&
                                      item.requirements.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                          {item.requirements
                                            .slice(0, 3)
                                            .map((req, i) => (
                                              <span
                                                key={i}
                                                className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[9px] font-bold uppercase tracking-wider rounded-md border border-gray-100"
                                              >
                                                {req}
                                              </span>
                                            ))}
                                          {item.requirements.length > 3 && (
                                            <span className="text-[9px] font-bold text-gray-300 self-center">
                                              + {item.requirements.length - 3}{" "}
                                              more
                                            </span>
                                          )}
                                        </div>
                                      )}
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <div className="flex flex-wrap gap-1.5">
                                      {item.interests?.length > 0 ? (
                                        <>
                                          {item.interests
                                            .slice(0, 3)
                                            .map((interest, i) => (
                                              <span
                                                key={i}
                                                className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-50 text-gray-400 border border-gray-100"
                                              >
                                                {interest}
                                              </span>
                                            ))}
                                          {item.interests.length > 3 && (
                                            <span className="text-[9px] font-bold text-gray-300 self-center">
                                              + {item.interests.length - 3} more
                                            </span>
                                          )}
                                        </>
                                      ) : (
                                        <span className="text-[10px] italic text-gray-300">
                                          No interests listed
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-3">
                                {activeTab === "projects" && (
                                  <div className="flex items-center gap-2 text-gray-700 font-black text-xs uppercase tracking-tighter">
                                    <Users className="h-4 w-4 shrink-0 text-amu-gold" />
                                    <span className="truncate">
                                      Creator: {item.projectCreator}
                                    </span>
                                  </div>
                                )}

                                {activeTab === "projects" &&
                                  item.teamMembers?.length > 0 && (
                                    <div className="flex flex-col gap-1 pl-6">
                                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">
                                        Team Members
                                      </p>
                                      {item.teamMembers
                                        .slice(0, 2)
                                        .map((tm, i) => (
                                          <span
                                            key={i}
                                            className="text-[10px] font-bold text-gray-400 uppercase tracking-tight"
                                          >
                                            • {tm.name}
                                          </span>
                                        ))}
                                    </div>
                                  )}

                                <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-tighter">
                                  <Building2 className="h-4 w-4 shrink-0" />
                                  <span className="truncate">
                                    {item.department}
                                  </span>
                                </div>
                                {activeTab === "users" && (
                                  <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-tighter">
                                    <Sparkles className="h-4 w-4 shrink-0" />
                                    <span>{item.role}</span>
                                  </div>
                                )}
                                {activeTab === "users" && (
                                  <div className="flex items-center gap-2 text-amu-green font-black text-[10px] uppercase tracking-widest bg-amu-green/5 px-3 py-1.5 rounded-xl w-fit">
                                    <BookOpen className="h-3.5 w-3.5" />
                                    <span>{item.projectCount} Projects</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-end">
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-gray-50 text-gray-400 group-hover:bg-amu-green group-hover:text-white rounded-xl transition-all">
                                  <ArrowRight className="h-5 w-5" />
                                </div>
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
              </div>
            </>
          )}
        </main>
      </div>
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projectID={selectedProjectID}
        onProfileClick={openProfile}
      />
      <UserProfileModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        universityID={selectedUserID}
        zIndex="z-[400]"
      />
    </div>
  );
};

export default ExplorePage;
