import { useState, useEffect } from "react";

export function useNetworkData() {
  const [networkData, setNetworkData] = useState({
    following: [],
    followers: [],
    sentCollaborations: [],
    receivedCollaborations: [],
    currentUser: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchNetworkData = () => {
    setLoading(true);
    fetch("/api/network")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setNetworkData(d);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/network")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setNetworkData(d);
      })
      .finally(() => setLoading(false));
  }, []);

  const executeCollabAction = async (requestID, action) => {
    if (action === "cancel") {
      setNetworkData((prev) => ({
        ...prev,
        sentCollaborations: prev.sentCollaborations.filter(
          (c) => c.requestID !== requestID,
        ),
        receivedCollaborations: prev.receivedCollaborations.filter(
          (c) => c.requestID !== requestID,
        ),
      }));
    }

    try {
      const res = await fetch("/api/network/collaboration", {
        method: action === "cancel" ? "DELETE" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestID,
          requestStatus: action === "accept" ? "ACCEPTED" : "REJECTED",
        }),
      });
      if (res.ok) {
        setTimeout(fetchNetworkData, 500);
      } else {
        const err = await res.json();
        alert(err.error || "Action failed");
        fetchNetworkData();
      }
    } catch (_e) {
      alert("Something went wrong");
      fetchNetworkData();
    }
  };

  const executeFollowAction = async (id, action, type) => {
    if (action === "cancel") {
      setNetworkData((prev) => ({
        ...prev,
        following: prev.following.filter(
          (f) => f.followingID !== id && f.id !== id,
        ),
        followers: prev.followers.filter(
          (f) => f.followerID !== id && f.id !== id,
        ),
      }));
    }

    try {
      const isCancel = action === "cancel";
      const res = await fetch("/api/network/follow", {
        method: isCancel ? "DELETE" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetID: type === "sent" ? id : undefined,
          followID: type === "received" ? id : undefined,
          requestStatus: action === "accept" ? "ACCEPTED" : "REJECTED",
        }),
      });
      if (res.ok) {
        setTimeout(fetchNetworkData, 500);
      } else {
        const err = await res.json();
        alert(err.error || "Action failed");
        fetchNetworkData();
      }
    } catch (_e) {
      alert("Something went wrong");
      fetchNetworkData();
    }
  };

  const executeUnfollow = async (targetID, direction = "following") => {
    try {
      const res = await fetch("/api/network/follow", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetID, direction }),
      });
      if (res.ok) {
        fetchNetworkData();
      } else {
        const err = await res.json();
        alert(err.error || "Action failed");
      }
    } catch (_e) {
      alert("Something went wrong");
    }
  };

  const followingAccepted = networkData.following
    .filter((f) => f.requestStatus === "ACCEPTED")
    .map((f) => ({
      id: f.id,
      universityID: f.followingID,
      name: f.following.name,
      department: f.following.department,
      avatar: f.following.profilePhoto || "/default-avatar.svg",
      role: "USER",
      followers: f.following.followers?.length || 0,
    }));

  const followingSent = networkData.following
    .filter((f) => f.requestStatus === "PENDING")
    .map((f) => ({
      id: f.id,
      universityID: f.followingID,
      name: f.following.name,
      department: f.following.department,
      avatar: f.following.profilePhoto || "/default-avatar.svg",
      status: "PENDING",
      followers: f.following.followers?.length || 0,
    }));

  const followersAccepted = networkData.followers
    .filter((f) => f.requestStatus === "ACCEPTED")
    .map((f) => ({
      id: f.id,
      universityID: f.followerID,
      name: f.follower.name,
      department: f.follower.department,
      avatar: f.follower.profilePhoto || "/default-avatar.svg",
      role: "USER",
      followers: f.follower.followers?.length || 0,
    }));

  const followersReceived = networkData.followers
    .filter((f) => f.requestStatus === "PENDING")
    .map((f) => ({
      id: f.id,
      universityID: f.followerID,
      name: f.follower.name,
      department: f.follower.department,
      avatar: f.follower.profilePhoto || "/default-avatar.svg",
      status: "PENDING",
      followers: f.follower.followers?.length || 0,
    }));

  const groupCollabs = (collabs) => {
    const grouped = {};
    const myID = networkData.currentUser?.universityID;

    collabs.forEach((c) => {
      const pid = c.projectID;
      const creatorID = c.project?.universityID;
      const isSent = networkData.sentCollaborations.some(
        (sc) => sc.requestID === c.requestID,
      );
      const partnerName = isSent
        ? c.receiver?.name || "Member"
        : c.sender?.name || "Member";
      const partnerID = isSent ? c.receiverID : c.senderID;

      if (!grouped[pid]) {
        const isCreatorMe = creatorID === myID;
        grouped[pid] = {
          isCreatorMe,
          id: c.requestID,
          projectId: pid,
          name: c.project?.title || "Project",
          creator: isCreatorMe
            ? `${c.project?.creator?.name} (You)`
            : c.project?.creator?.name || "Unknown",
          creatorID: c.project?.universityID,
          team: [],
          avatar: c.project?.creator?.profilePhoto || "/default-avatar.svg",
          status: c.project?.projectStatus || "ACTIVE",
          createdAt: c.project?.createdAt,
        };

        if (myID && myID !== creatorID) {
          const myNameWithYou = networkData.currentUser?.name
            ? `${networkData.currentUser.name} (You)`
            : "You";
          grouped[pid].team.push({ name: myNameWithYou, universityID: myID });
        }
      }

      if (
        partnerID !== creatorID &&
        partnerID !== myID &&
        !grouped[pid].team.some((m) => m.universityID === partnerID)
      ) {
        grouped[pid].team.push({ name: partnerName, universityID: partnerID });
      }
    });
    return Object.values(grouped);
  };

  const allAcceptedCollabs = [
    ...networkData.sentCollaborations.filter(
      (c) => c.requestStatus === "ACCEPTED",
    ),
    ...networkData.receivedCollaborations.filter(
      (c) => c.requestStatus === "ACCEPTED",
    ),
  ];

  const collabOngoing = groupCollabs(
    allAcceptedCollabs.filter((c) => c.project?.projectStatus !== "COMPLETED"),
  );
  const collabFinished = groupCollabs(
    allAcceptedCollabs.filter((c) => c.project?.projectStatus === "COMPLETED"),
  );

  const collabReceived = networkData.receivedCollaborations
    .filter(
      (c) =>
        c.requestStatus === "PENDING" &&
        c.receiverID === c.project?.universityID,
    )
    .map((c) => ({
      id: c.requestID,
      projectId: c.projectID,
      name: c.project?.title || "Project",
      from: c.sender?.name,
      senderID: c.senderID,
      avatar: c.sender?.profilePhoto || "/default-avatar.svg",
      status: "PENDING",
    }));

  const collabInvitesReceived = networkData.receivedCollaborations
    .filter(
      (c) =>
        c.requestStatus === "PENDING" &&
        c.receiverID !== c.project?.universityID,
    )
    .map((c) => ({
      id: c.requestID,
      projectId: c.projectID,
      name: c.project?.title || "Project",
      from: c.sender?.name,
      senderID: c.senderID,
      avatar: c.sender?.profilePhoto || "/default-avatar.svg",
      status: "PENDING",
      isInvite: true,
    }));

  const collabSent = networkData.sentCollaborations
    .filter(
      (c) =>
        c.requestStatus === "PENDING" && c.senderID !== c.project?.universityID,
    )
    .map((c) => ({
      id: c.requestID,
      projectId: c.projectID,
      name: c.project?.title || "Project",
      to: c.receiver?.name,
      receiverID: c.receiverID,
      avatar: c.receiver?.profilePhoto || "/default-avatar.svg",
      status: "PENDING",
    }));

  const collabInvitesSent = networkData.sentCollaborations
    .filter(
      (c) =>
        c.requestStatus === "PENDING" && c.senderID === c.project?.universityID,
    )
    .map((c) => ({
      id: c.requestID,
      projectId: c.projectID,
      name: c.project?.title || "Project",
      to: c.receiver?.name,
      receiverID: c.receiverID,
      avatar: c.receiver?.profilePhoto || "/default-avatar.svg",
      status: "PENDING",
      isInvite: true,
    }));

  return {
    networkData,
    loading,
    fetchNetworkData,
    executeCollabAction,
    executeFollowAction,
    executeUnfollow,
    followingAccepted,
    followingSent,
    followersAccepted,
    followersReceived,
    collabOngoing,
    collabFinished,
    collabReceived,
    collabInvitesReceived,
    collabSent,
    collabInvitesSent,
  };
}
