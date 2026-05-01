import React from "react";
import SearchHero from "./SearchHero";
import ExploreLayout from "./ExploreLayout";
import ExploreModals from "./ExploreModals";

const ExplorePageContent = ({
  activeTab,
  projectSearch,
  userSearch,
  handleSearchChange,
  isFilteringProjects,
  isFilteringUsers,
  projectDept,
  userDept,
  selectedDomain,
  selectedStatus,
  selectedSkills,
  skillInput,
  setSkillInput,
  selectedInterests,
  interestInput,
  setInterestInput,
  currentUser,
  myProjects,
  matchingProjectID,
  filteredProjects,
  filteredUsers,
  setActiveTab,
  handleDeptChange,
  handleDomainChange,
  handleStatusChange,
  handleSkillsChange,
  handleInterestsChange,
  handleMatchingProjectChange,
  clearFilters,
  openProject,
  openProfile,
  isProjectModalOpen,
  setIsProjectModalOpen,
  selectedProjectID,
  isUserModalOpen,
  setIsUserModalOpen,
  selectedUserID,
}) => (
  <div className="max-w-7xl mx-auto py-4 px-6 space-y-8">
    <SearchHero
      activeTab={activeTab}
      searchValue={activeTab === "projects" ? projectSearch : userSearch}
      onSearchChange={handleSearchChange}
      isFiltering={
        activeTab === "projects" ? isFilteringProjects : isFilteringUsers
      }
    />

    <ExploreLayout
      activeTab={activeTab}
      filters={{
        projectDept,
        userDept,
        selectedDomain,
        selectedStatus,
        selectedSkills,
        skillInput,
        selectedInterests,
        interestInput,
        currentUser,
        myProjects,
        matchingProjectID,
      }}
      results={{
        projectCount: filteredProjects.length,
        userCount: filteredUsers.length,
        isFilteringProjects,
        isFilteringUsers,
        filtered: activeTab === "projects" ? filteredProjects : filteredUsers,
      }}
      handlers={{
        onTabChange: setActiveTab,
        onDeptChange: handleDeptChange,
        onDomainChange: handleDomainChange,
        onStatusChange: handleStatusChange,
        onSkillsChange: handleSkillsChange,
        onSkillInputChange: setSkillInput,
        onInterestsChange: handleInterestsChange,
        onInterestInputChange: setInterestInput,
        onMatchingProjectChange: handleMatchingProjectChange,
        onClearFilters: clearFilters,
        onProjectClick: openProject,
        onUserClick: openProfile,
      }}
    />

    <ExploreModals
      isProjectModalOpen={isProjectModalOpen}
      setIsProjectModalOpen={setIsProjectModalOpen}
      selectedProjectID={selectedProjectID}
      isUserModalOpen={isUserModalOpen}
      setIsUserModalOpen={setIsUserModalOpen}
      selectedUserID={selectedUserID}
      onProfileClick={openProfile}
    />
  </div>
);

export default ExplorePageContent;
