import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useProjectActions(projectId) {
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [requested, setRequested] = useState(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [collaborationID, setCollaborationID] = useState(null);

  const fetchProjectData = useCallback(() => {
    // Use functional update or check to avoid unnecessary sets
    setLoading((prev) => (prev ? prev : true));
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch(`/api/projects/${projectId}`).then((r) => r.json()),
      fetch("/api/network").then((r) => r.json()),
    ])
      .then(([authRes, projRes, netRes]) => {
        if (!authRes.error) setCurrentUser(authRes.user);
        if (!projRes.error) {
          const mapped = {
            id: projRes.projectID,
            title: projRes.title,
            domain: projRes.projectDomain,
            department: projRes.creator?.department || "University",
            description: projRes.description,
            projectStatus:
              projRes.projectStatus === "ACTIVE"
                ? "Active"
                : projRes.projectStatus === "ON_HOLD"
                  ? "On Hold"
                  : projRes.projectStatus === "PROPOSED"
                    ? "Proposed"
                    : projRes.projectStatus === "ARCHIVED"
                      ? "Archived"
                      : "Completed",
            projectCreator: projRes.creator?.name || "Unknown",
            moderationStatus: projRes.moderationStatus,
            adminFeedback: projRes.adminFeedback,
            creatorID: projRes.universityID,
            time: new Date(projRes.createdAt).toLocaleString("en-US", {
              dateStyle: "full",
              timeStyle: "short",
            }),
            team:
              projRes.collaborations?.map((c) => ({
                requestID: c.requestID,
                name: c.sender?.name || "Member",
                role: c.sender?.role || "Researcher",
                avatar: "/default-avatar.svg",
              })) || [],
            externalLinks: projRes.externalLinks?.map((url) => ({ url })) || [],
            requirements: projRes.requirements || [],
          };
          setProject(mapped);
          setEditForm(mapped);
        }
        if (!netRes.error) {
          const collab = [
            ...(netRes.sentCollaborations || []),
            ...(netRes.receivedCollaborations || []),
          ].find((c) => c.projectID === projectId);
          if (collab) {
            setRequested(collab.requestStatus);
            setCollaborationID(collab.requestID);
          } else {
            setRequested(null);
            setCollaborationID(null);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    if (projectId) fetchProjectData();
  }, [projectId, fetchProjectData]);

  const isOwner =
    currentUser &&
    (project?.creatorID === currentUser.universityID ||
      currentUser.role === "ADMIN");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          removedMembers: project.team
            .filter(
              (m) => !editForm.team.find((t) => t.requestID === m.requestID),
            )
            .map((m) => m.requestID),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setProject({
          ...project,
          ...editForm,
          moderationStatus: data.moderationStatus,
          adminFeedback: data.adminFeedback,
        });
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      if (res.ok) router.push("/projects");
    } catch (err) {
      console.error(err);
    }
  };

  const handleLeaveCollaboration = async () => {
    if (!confirm("Are you sure you want to leave this project?")) return;
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
      }
    } catch (_e) {
      console.error(_e);
    } finally {
      setRequestLoading(false);
    }
  };

  const handleSendRequest = async () => {
    setRequestLoading(true);
    try {
      const res = await fetch("/api/network/collaboration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectID: projectId,
          receiverID: project.creatorID,
        }),
      });
      if (res.ok) setRequested("PENDING");
    } catch (_e) {
      console.error(_e);
    } finally {
      setRequestLoading(false);
    }
  };

  return {
    project,
    currentUser,
    loading,
    isEditing,
    setIsEditing,
    editForm,
    setEditForm,
    isSaving,
    isOwner,
    handleSave,
    handleDelete,
    requested,
    requestLoading,
    handleSendRequest,
    handleLeaveCollaboration,
  };
}
