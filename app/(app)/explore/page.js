"use client";
import React from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ExplorePageContent from "@/components/explore/ExplorePageContent";
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
    <ExplorePageContent
      activeTab={activeTab}
      projectSearch={projectSearch}
      userSearch={userSearch}
      handleSearchChange={handleSearchChange}
      isFilteringProjects={isFilteringProjects}
      isFilteringUsers={isFilteringUsers}
      projectDept={projectDept}
      userDept={userDept}
      selectedDomain={selectedDomain}
      selectedStatus={selectedStatus}
      selectedSkills={selectedSkills}
      skillInput={skillInput}
      setSkillInput={setSkillInput}
      selectedInterests={selectedInterests}
      interestInput={interestInput}
      setInterestInput={setInterestInput}
      currentUser={currentUser}
      myProjects={myProjects}
      matchingProjectID={matchingProjectID}
      filteredProjects={filteredProjects}
      filteredUsers={filteredUsers}
      setActiveTab={setActiveTab}
      handleDeptChange={handleDeptChange}
      handleDomainChange={handleDomainChange}
      handleStatusChange={handleStatusChange}
      handleSkillsChange={handleSkillsChange}
      handleInterestsChange={handleInterestsChange}
      handleMatchingProjectChange={handleMatchingProjectChange}
      clearFilters={clearFilters}
      openProject={openProject}
      openProfile={openProfile}
      isProjectModalOpen={isProjectModalOpen}
      setIsProjectModalOpen={setIsProjectModalOpen}
      selectedProjectID={selectedProjectID}
      isUserModalOpen={isUserModalOpen}
      setIsUserModalOpen={setIsUserModalOpen}
      selectedUserID={selectedUserID}
    />
  );
};

export default ExplorePage;
