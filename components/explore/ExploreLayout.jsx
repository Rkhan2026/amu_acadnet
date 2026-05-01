import React from "react";
import FilterSidebar from "./FilterSidebar";
import DiscoveryTabs from "./DiscoveryTabs";
import DiscoveryResults from "./DiscoveryResults";

const ExploreLayout = ({ activeTab, filters, results, handlers }) => (
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
    <FilterSidebar
      activeTab={activeTab}
      deptValue={
        activeTab === "projects" ? filters.projectDept : filters.userDept
      }
      onDeptChange={handlers.onDeptChange}
      domainValue={filters.selectedDomain}
      onDomainChange={handlers.onDomainChange}
      statusValue={filters.selectedStatus}
      onStatusChange={handlers.onStatusChange}
      skills={filters.selectedSkills}
      onSkillsChange={handlers.onSkillsChange}
      skillInput={filters.skillInput}
      onSkillInputChange={handlers.onSkillInputChange}
      interests={filters.selectedInterests}
      onInterestsChange={handlers.onInterestsChange}
      interestInput={filters.interestInput}
      onInterestInputChange={handlers.onInterestInputChange}
      currentUser={filters.currentUser}
      myProjects={filters.myProjects}
      matchingProjectID={filters.matchingProjectID}
      onMatchingProjectChange={handlers.onMatchingProjectChange}
      onClearFilters={handlers.onClearFilters}
    />

    <main className="lg:col-span-3 space-y-6">
      <DiscoveryTabs
        activeTab={activeTab}
        onTabChange={handlers.onTabChange}
        projectCount={results.projectCount}
        userCount={results.userCount}
        isFilteringProjects={results.isFilteringProjects}
        isFilteringUsers={results.isFilteringUsers}
      />

      <DiscoveryResults
        activeTab={activeTab}
        results={results.filtered}
        isFiltering={
          activeTab === "projects"
            ? results.isFilteringProjects
            : results.isFilteringUsers
        }
        onProjectClick={handlers.onProjectClick}
        onUserClick={handlers.onUserClick}
      />
    </main>
  </div>
);

export default ExploreLayout;
