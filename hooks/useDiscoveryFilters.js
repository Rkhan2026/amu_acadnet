import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export function useDiscoveryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [projectSearch, setProjectSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [projectDept, setProjectDept] = useState("");
  const [userDept, setUserDept] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [interestInput, setInterestInput] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [matchingProjectID, setMatchingProjectID] = useState("");

  const [projectsData, setProjectsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isFilteringProjects, setIsFilteringProjects] = useState(false);
  const [isFilteringUsers, setIsFilteringUsers] = useState(false);

  const activeTab = useMemo(() => {
    return tabParam === "users" ? "users" : "projects";
  }, [tabParam]);

  const setActiveTab = (tab) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/users?all=true").then((r) => r.json()),
      fetch("/api/auth/me").then((r) => r.json()),
    ])
      .then(([pData, rData, authData]) => {
        if (authData && authData.user) {
          setCurrentUser(authData.user);
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
              interests: u.academicProfile?.interestsSkills || [],
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

      const matchesStatus =
        !selectedStatus || p.projectStatus === selectedStatus;

      let matchesSkills = true;
      if (selectedSkills.length > 0) {
        const pReqs = (p.requirements || []).map((r) => r.toLowerCase());
        matchesSkills = selectedSkills.every((skill) =>
          pReqs.some((req) => req.includes(skill.toLowerCase())),
        );
      }

      return (
        matchesSearch &&
        matchesDept &&
        matchesDomain &&
        matchesSkills &&
        matchesStatus
      );
    });
  }, [
    projectSearch,
    projectDept,
    selectedDomain,
    projectsData,
    selectedSkills,
    selectedStatus,
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

      const searchTerms = matchingProjectID
        ? projectReqs
        : selectedInterests.map((s) => s.trim().toLowerCase());

      if (searchTerms.length > 0) {
        matchedSkills = u.interests.filter((interest) =>
          searchTerms.some((term) => interest.toLowerCase().includes(term)),
        );
        matchesInterests = matchedSkills.length > 0;
      }

      let matchScore = 0;
      if (searchTerms.length > 0) {
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

  useEffect(() => {
    const timer = setTimeout(() => setIsFilteringProjects(false), 300);
    return () => clearTimeout(timer);
  }, [
    projectSearch,
    projectDept,
    selectedDomain,
    selectedSkills,
    selectedStatus,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setIsFilteringUsers(false), 300);
    return () => clearTimeout(timer);
  }, [userSearch, userDept, selectedInterests, matchingProjectID]);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [selectedProjectID, setSelectedProjectID] = useState(null);

  const openProfile = (uid) => {
    setSelectedUserID(uid);
    setIsUserModalOpen(true);
  };

  const openProject = (pid) => {
    setSelectedProjectID(pid);
    setIsProjectModalOpen(true);
  };

  const handleSearchChange = (val) => {
    if (activeTab === "projects") {
      setProjectSearch(val);
      setIsFilteringProjects(true);
    } else {
      setUserSearch(val);
      setIsFilteringUsers(true);
    }
  };

  const handleDeptChange = (val) => {
    if (activeTab === "projects") {
      setProjectDept(val);
      setIsFilteringProjects(true);
    } else {
      setUserDept(val);
      setIsFilteringUsers(true);
    }
  };

  const handleDomainChange = (val) => {
    setSelectedDomain(val);
    setIsFilteringProjects(true);
  };

  const handleStatusChange = (val) => {
    setSelectedStatus(val);
    setIsFilteringProjects(true);
  };

  const handleSkillsChange = (val) => {
    setSelectedSkills(val);
    setIsFilteringProjects(true);
  };

  const handleInterestsChange = (val) => {
    setSelectedInterests(val);
    setIsFilteringUsers(true);
  };

  const handleMatchingProjectChange = (val) => {
    setMatchingProjectID(val);
    setSelectedInterests([]);
    setIsFilteringUsers(true);
  };

  const clearFilters = () => {
    if (activeTab === "projects") {
      setProjectDept("");
      setProjectSearch("");
      setSelectedDomain("");
      setSelectedStatus("");
      setSelectedSkills([]);
      setSkillInput("");
    } else {
      setUserDept("");
      setUserSearch("");
      setSelectedInterests([]);
      setInterestInput("");
      setMatchingProjectID("");
    }
  };

  return {
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
    projectsData,
    usersData,
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
    isUserModalOpen,
    setIsUserModalOpen,
    selectedUserID,
    selectedProjectID,
    openProfile,
    openProject,
    handleSearchChange,
    handleDeptChange,
    handleDomainChange,
    handleStatusChange,
    handleSkillsChange,
    handleInterestsChange,
    handleMatchingProjectChange,
  };
}
