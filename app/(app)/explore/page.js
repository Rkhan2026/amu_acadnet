"use client";
import React from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import SearchHero from "@/components/explore/SearchHero";
import ExploreModals from "@/components/explore/ExploreModals";
import ExploreLayout from "@/components/explore/ExploreLayout";
import { useDiscoveryFilters } from "@/hooks/useDiscoveryFilters";

const ExplorePage = () => {
  const {
    activeTab,
    setActiveTab,
    projectSearch,
    userSearch,
    projectDept,
    userDept,
    selectedDomain,
    selectedStatus,
    selectedInterests,
    interestInput,
    setInterestInput,
    selectedSkills,
    skillInput,
    setSkillInput,
    matchingProjectID,
    myProjects,
    currentUser,
    loading,
    isFilteringProjects,
    isFilteringUsers,
    filteredProjects,
    filteredUsers,
    clearFilters,
    isProjectModalOpen,
    setIsProjectModalOpen,
    selectedProjectID,
    isUserModalOpen,
    setIsUserModalOpen,
    selectedUserID,
    openProfile,
    openProject,
    handleSearchChange,
    handleDeptChange,
    handleDomainChange,
    handleStatusChange,
    handleSkillsChange,
    handleInterestsChange,
    handleMatchingProjectChange,
  } = useDiscoveryFilters();

  if (loading)
    return <LoadingSpinner fullPage message="Searching discovery results..." />;

  return (
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
};

export default ExplorePage;
