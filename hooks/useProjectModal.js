"use client";
import { useState, useEffect } from "react";

export function useProjectModal({
  isOpen,
  projectID,
  initialProject,
  isAdminProp,
}) {
  const [project, setProject] = useState(initialProject || null);
  const [loading, setLoading] = useState(!initialProject);
  const [currentUser, setCurrentUser] = useState(null);
  const [requested, setRequested] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [collaborationID, setCollaborationID] = useState(null);
  const [prevID, setPrevID] = useState(null);

  const currentProjectID =
    projectID || initialProject?.projectID || initialProject?.id;

  if (currentProjectID !== prevID) {
    setPrevID(currentProjectID);
    setProject(initialProject || null);
    setLoading(!initialProject && !!currentProjectID);
    setRequested(null);
    setCollaborationID(null);
  }

  useEffect(() => {
    if (isOpen && currentProjectID) {
      const fetchData = async () => {
        if (!project && !initialProject) setLoading(true);

        try {
          fetch("/api/auth/me")
            .then((r) => r.json())
            .then((res) => {
              if (res && res.user) setCurrentUser(res.user);
            })
            .catch(() => {});

          let activeProject = project || initialProject;

          if (
            !activeProject ||
            (!activeProject.requirements && currentProjectID)
          ) {
            const projRes = await fetch(
              `/api/projects/${currentProjectID}`,
            ).then((r) => r.json());
            if (!projRes.error) {
              setProject(projRes);
              activeProject = projRes;

              // Immediately set collaboration status if available in response
              if (projRes.userCollaboration) {
                setRequested(projRes.userCollaboration.requestStatus);
                setCollaborationID(projRes.userCollaboration.requestID);
              }
            }
          } else if (activeProject?.userCollaboration) {
            // Already have project with collaboration status
            setRequested(activeProject.userCollaboration.requestStatus);
            setCollaborationID(activeProject.userCollaboration.requestID);
          }

          // Once we have project data (or confirmed we have it), stop modal loading
          setLoading(false);

          // Collaboration status is now handled instantly via the project API (userCollaboration field)
        } catch (err) {
          console.error("Error fetching project data:", err);
          setLoading(false);
        }
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentProjectID]);

  const handleSendRequest = async () => {
    setRequestLoading(true);
    try {
      const res = await fetch("/api/network/collaboration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectID: project.projectID,
          receiverID: project.universityID,
        }),
      });
      if (res.ok) {
        setRequested("PENDING");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to send request");
      }
    } catch (_e) {
      alert("Something went wrong");
    } finally {
      setRequestLoading(false);
    }
  };

  const handleLeaveCollaboration = async () => {
    if (
      !confirm("Are you sure you want to stop collaborating on this project?")
    )
      return;

    setRequestLoading(true);
    try {
      const res = await fetch("/api/network/collaboration", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestID: collaborationID }),
      });
      if (res.ok) {
        setRequested(null);
        setCollaborationID(null);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to leave collaboration");
      }
    } catch (_e) {
      alert("Something went wrong");
    } finally {
      setRequestLoading(false);
    }
  };

  const isAdmin = isAdminProp || currentUser?.role === "ADMIN";
  const isOwner =
    currentUser && project?.universityID === currentUser.universityID;

  const formatStatus = (s) => s?.replace(/_/g, " ");

  return {
    project,
    loading,
    currentUser,
    requested,
    requestLoading,
    collaborationID,
    isAdmin,
    isOwner,
    handleSendRequest,
    handleLeaveCollaboration,
    formatStatus,
  };
}
