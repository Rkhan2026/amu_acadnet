import React from "react";
import { Filter, ChevronRight } from "lucide-react";
import { AMU_DEPARTMENTS } from "@/lib/utils";
import DomainSelect from "@/components/ui/DomainSelect";
import TagInput from "@/components/ui/TagInput";

export default function FilterSidebar({
  activeTab,
  deptValue,
  onDeptChange,
  domainValue,
  onDomainChange,
  statusValue,
  onStatusChange,
  skills,
  onSkillsChange,
  skillInput,
  onSkillInputChange,
  interests,
  onInterestsChange,
  interestInput,
  onInterestInputChange,
  currentUser,
  myProjects,
  matchingProjectID,
  onMatchingProjectChange,
  onClearFilters,
  router,
}) {
  const PROJECT_STATUSES = ["PROPOSED", "ACTIVE", "ON_HOLD", "COMPLETED"];

  return (
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
              value={deptValue}
              onChange={(e) => onDeptChange(e.target.value)}
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
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                  Project Domain
                </label>
                <DomainSelect value={domainValue} onChange={onDomainChange} />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                  Project Status
                </label>
                <select
                  value={statusValue}
                  onChange={(e) => onStatusChange(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-amu-green focus:bg-white rounded-2xl text-sm font-bold text-gray-700 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  {PROJECT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status
                        .replace(/_/g, " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-50">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                  Required Skills
                </label>
                <TagInput
                  tags={skills}
                  onAdd={(skill) =>
                    onSkillsChange([...skills, skill.toLowerCase()])
                  }
                  onRemove={(idx) =>
                    onSkillsChange(skills.filter((_, i) => i !== idx))
                  }
                  inputValue={skillInput}
                  onInputChange={onSkillInputChange}
                  placeholder="e.g. Python, AI..."
                />
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                Interests
              </label>
              <TagInput
                tags={interests}
                onAdd={(interest) =>
                  onInterestsChange([...interests, interest.toLowerCase()])
                }
                onRemove={(idx) =>
                  onInterestsChange(interests.filter((_, i) => i !== idx))
                }
                inputValue={interestInput}
                onInputChange={onInterestInputChange}
                placeholder="e.g. ML, Physics..."
              />
            </div>
          )}

          {activeTab === "users" && currentUser && myProjects.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-gray-50">
              <label className="text-[10px] font-black text-amu-green uppercase tracking-[0.2em] ml-1">
                Match My Project
              </label>
              <select
                value={matchingProjectID}
                onChange={(e) => onMatchingProjectChange(e.target.value)}
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
          onClick={onClearFilters}
          className="w-full py-4 text-gray-400 hover:text-gray-600 font-bold text-xs uppercase tracking-widest transition-colors"
        >
          Clear all filters
        </button>
      </section>
    </aside>
  );
}
