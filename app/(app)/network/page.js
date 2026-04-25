"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Users,
  X,
  Check,
  MoreVertical,
  Briefcase,
  UserCheck,
  UserMinus,
  Clock,
} from "lucide-react";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import ConfirmationModal from "@/components/ConfirmationModal";
import UserProfileModal from "@/components/UserProfileModal";
import ProjectModal from "@/components/ProjectModal";

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState("following");
  const [subTab, setSubTab] = useState("accepted");
  const [networkData, setNetworkData] = useState({
    following: [],
    followers: [],
    sentCollaborations: [],
    receivedCollaborations: [],
  });
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    onConfirm: () => {},
    variant: "danger",
  });

  const [selectedUserID, setSelectedUserID] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedProjectID, setSelectedProjectID] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const openProfile = (uid) => {
    setSelectedUserID(uid);
    setIsUserModalOpen(true);
  };

  const openProject = (pid) => {
    setSelectedProjectID(pid);
    setIsProjectModalOpen(true);
  };

  const closeModal = () =>
    setModalConfig((prev) => ({ ...prev, isOpen: false }));

  const fetchNetworkData = () => {
    setLoading(true);
    fetch("/api/network")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setNetworkData(d);
      })
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    fetchNetworkData();
  }, []);

  const handleCollabRequest = async (requestID, action) => {
    if (action === "reject") {
      setModalConfig({
        isOpen: true,
        title: "Reject Collaboration?",
        message: "Are you sure you want to reject this collaboration request?",
        confirmText: "Reject",
        variant: "danger",
        onConfirm: () => executeCollabAction(requestID, "reject"),
      });
      return;
    }
    executeCollabAction(requestID, action);
  };

  const handleLeaveCollaboration = (requestID) => {
    setModalConfig({
      isOpen: true,
      title: "Stop Collaborating?",
      message:
        "Are you sure you want to stop collaborating on this project? This action cannot be undone.",
      confirmText: "Stop Collaborating",
      variant: "danger",
      onConfirm: () => executeCollabAction(requestID, "cancel"),
    });
  };

  const executeCollabAction = async (requestID, action) => {
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
        fetchNetworkData();
      } else {
        const err = await res.json();
        alert(err.error || "Action failed");
      }
    } catch (_e) {
      alert("Something went wrong");
    }
  };

  const handleFollowRequest = async (id, action, type) => {
    if (action === "reject") {
      setModalConfig({
        isOpen: true,
        title: "Reject Follow Request?",
        message: "Are you sure you want to reject this follow request?",
        confirmText: "Reject",
        variant: "danger",
        onConfirm: () => executeFollowAction(id, "reject", type),
      });
      return;
    }
    executeFollowAction(id, action, type);
  };

  const executeFollowAction = async (id, action, type) => {
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
        fetchNetworkData();
      } else {
        const err = await res.json();
        alert(err.error || "Action failed");
      }
    } catch (_e) {
      alert("Something went wrong");
    }
  };

  const handleUnfollowRequest = (targetID, isFollower = false) => {
    setModalConfig({
      isOpen: true,
      title: isFollower ? "Remove Follower?" : "Unfollow Researcher?",
      message: isFollower
        ? "Are you sure you want to remove this researcher from your followers?"
        : "Are you sure you want to unfollow this researcher?",
      confirmText: isFollower ? "Remove" : "Unfollow",
      variant: "danger",
      onConfirm: () =>
        executeUnfollow(targetID, isFollower ? "follower" : "following"),
    });
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

  // Format data
  const followingAccepted = networkData.following
    .filter((f) => f.requestStatus === "ACCEPTED")
    .map((f) => ({
      id: f.id,
      universityID: f.followingID,
      name: f.following.name,
      department: f.following.department,
      avatar: "/default-avatar.svg",
      role: "USER",
      followers: f.following.followers?.length || 0,
      mutualConnections: 0,
    }));
  const followingSent = networkData.following
    .filter((f) => f.requestStatus === "PENDING")
    .map((f) => ({
      id: f.id,
      universityID: f.followingID,
      name: f.following.name,
      department: f.following.department,
      avatar: "/default-avatar.svg",
      role: "USER",
      status: "PENDING",
      followers: f.following.followers?.length || 0,
      mutualConnections: 0,
    }));

  const followersAccepted = networkData.followers
    .filter((f) => f.requestStatus === "ACCEPTED")
    .map((f) => ({
      id: f.id,
      universityID: f.followerID,
      name: f.follower.name,
      department: f.follower.department,
      avatar: "/default-avatar.svg",
      role: "USER",
      followers: f.follower.followers?.length || 0,
      mutualConnections: 0,
    }));
  const followersReceived = networkData.followers
    .filter((f) => f.requestStatus === "PENDING")
    .map((f) => ({
      id: f.id,
      universityID: f.followerID,
      name: f.follower.name,
      department: f.follower.department,
      avatar: "/default-avatar.svg",
      role: "USER",
      status: "PENDING",
      followers: f.follower.followers?.length || 0,
      mutualConnections: 0,
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
          team: [],
          teamIDs: [],
          avatar: "/default-avatar.svg",
          status: c.project?.projectStatus || "ACTIVE",
          createdAt: c.project?.createdAt,
        };

        // Always add current user ("You") if they are not the creator
        if (myID && myID !== creatorID) {
          const myNameWithYou = networkData.currentUser?.name
            ? `${networkData.currentUser.name} (You)`
            : "You";
          grouped[pid].team.push(myNameWithYou);
          grouped[pid].teamIDs.push(myID);
        }
      }

      // Add partner if not creator and not already added
      if (
        partnerID !== creatorID &&
        partnerID !== myID &&
        !grouped[pid].teamIDs.includes(partnerID)
      ) {
        const isPartnerMe = partnerID === myID;
        const finalPartnerName = isPartnerMe
          ? `${partnerName} (You)`
          : partnerName;
        grouped[pid].team.push(finalPartnerName);
        grouped[pid].teamIDs.push(partnerID);
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
      avatar: "/default-avatar.svg",
      status: "PENDING",
      isInvite: false,
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
      avatar: "/default-avatar.svg",
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
      avatar: "/default-avatar.svg",
      status: "PENDING",
      isInvite: false,
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
      avatar: "/default-avatar.svg",
      status: "PENDING",
      isInvite: true,
    }));

  const tabs = [
    {
      id: "following",
      label: "Following",
      count: followingAccepted.length + followingSent.length,
      icon: UserCheck,
    },
    {
      id: "followers",
      label: "Followers",
      count: followersAccepted.length + followersReceived.length,
      icon: Users,
    },
    {
      id: "collaborations",
      label: "Collaborations",
      count:
        collabOngoing.length +
        collabFinished.length +
        collabReceived.length +
        collabSent.length +
        collabInvitesSent.length +
        collabInvitesReceived.length,
      icon: Briefcase,
    },
  ];

  const renderContent = () => {
    if (loading)
      return (
        <div className="col-span-full py-20">
          <LoadingSpinner message="Loading network activity..." />
        </div>
      );

    switch (activeTab) {
      case "following":
        return subTab === "accepted"
          ? followingAccepted.map((u, index) => (
              <NetworkCard
                key={u.id || `follow-acc-${index}`}
                user={u}
                type="following"
                onAction={handleUnfollowRequest}
                onViewProfile={openProfile}
              />
            ))
          : followingSent.map((u, index) => (
              <FollowRequestCard
                key={u.id || `follow-sent-${index}`}
                request={u}
                type="sent"
                onAction={handleFollowRequest}
                onViewProfile={openProfile}
              />
            ));
      case "followers":
        return subTab === "accepted"
          ? followersAccepted.map((u, index) => (
              <NetworkCard
                key={u.id || `follower-acc-${index}`}
                user={u}
                type="follower"
                onAction={(id) => handleUnfollowRequest(id, true)}
                onViewProfile={openProfile}
              />
            ))
          : followersReceived.map((u, index) => (
              <FollowRequestCard
                key={u.id || `follower-rec-${index}`}
                request={u}
                type="received"
                onAction={handleFollowRequest}
                onViewProfile={openProfile}
              />
            ));
      case "collaborations":
        if (subTab === "ongoing")
          return collabOngoing.map((c, index) => (
            <CollaborationCard
              key={c.id || `collab-on-${index}`}
              collab={c}
              onLeave={() => handleLeaveCollaboration(c.id)}
              onViewProfile={openProfile}
              onViewProject={openProject}
            />
          ));
        if (subTab === "finished")
          return collabFinished.map((c, index) => (
            <CollaborationCard
              key={c.id || `collab-fin-${index}`}
              collab={c}
              onLeave={() => handleLeaveCollaboration(c.id)}
              onViewProfile={openProfile}
              onViewProject={openProject}
            />
          ));

        if (subTab === "received")
          return collabReceived.map((r, index) => (
            <CollabRequestCard
              key={r.id || `collab-rec-${index}`}
              request={r}
              type="received"
              onAction={handleCollabRequest}
              onViewProfile={openProfile}
              onViewProject={openProject}
            />
          ));
        if (subTab === "invites_rec")
          return collabInvitesReceived.map((r, index) => (
            <CollabRequestCard
              key={r.id || `collab-inv-rec-${index}`}
              request={r}
              type="received"
              onAction={handleCollabRequest}
              onViewProfile={openProfile}
              onViewProject={openProject}
            />
          ));
        if (subTab === "sent")
          return collabSent.map((r, index) => (
            <CollabRequestCard
              key={r.id || `collab-sent-${index}`}
              request={r}
              type="sent"
              onAction={handleCollabRequest}
              onViewProfile={openProfile}
              onViewProject={openProject}
            />
          ));
        if (subTab === "invites_sent")
          return collabInvitesSent.map((r, index) => (
            <CollabRequestCard
              key={r.id || `collab-inv-sent-${index}`}
              request={r}
              type="sent"
              onAction={handleCollabRequest}
              onViewProfile={openProfile}
              onViewProject={openProject}
            />
          ));
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="py-8 px-4 md:px-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            My Network
          </h1>
          <p className="text-gray-500 font-medium">
            Manage your academic connections, follow requests, and research
            collaborations.
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-8 border-b border-gray-100 pb-0 overflow-x-auto scroller-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSubTab(tab.id === "collaborations" ? "ongoing" : "accepted");
            }}
            className={`pb-4 px-2 flex items-center gap-2 font-bold transition-all relative whitespace-nowrap ${
              activeTab === tab.id
                ? "text-amu-green"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
            <span className="bg-amu-green/10 text-amu-green px-2 py-0.5 rounded-lg text-xs">
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-amu-green rounded-t-full mt-auto" />
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-3 mb-8">
        {activeTab === "collaborations" ? (
          <>
            <SubTabButton
              active={subTab === "received"}
              onClick={() => setSubTab("received")}
              label="Received"
              count={collabReceived.length}
            />
            <SubTabButton
              active={subTab === "invites_rec"}
              onClick={() => setSubTab("invites_rec")}
              label="Invites (In)"
              count={collabInvitesReceived.length}
            />
            <SubTabButton
              active={subTab === "sent"}
              onClick={() => setSubTab("sent")}
              label="Sent"
              count={collabSent.length}
            />
            <SubTabButton
              active={subTab === "invites_sent"}
              onClick={() => setSubTab("invites_sent")}
              label="Invites (Out)"
              count={collabInvitesSent.length}
            />
            <SubTabButton
              active={subTab === "ongoing"}
              onClick={() => setSubTab("ongoing")}
              label="Ongoing"
              count={collabOngoing.length}
            />
            <SubTabButton
              active={subTab === "finished"}
              onClick={() => setSubTab("finished")}
              label="Finished"
              count={collabFinished.length}
            />
          </>
        ) : activeTab === "following" ? (
          <>
            <SubTabButton
              active={subTab === "sent"}
              onClick={() => setSubTab("sent")}
              label="Sent"
              count={followingSent.length}
            />
            <SubTabButton
              active={subTab === "accepted"}
              onClick={() => setSubTab("accepted")}
              label="Accepted"
              count={followingAccepted.length}
            />
          </>
        ) : (
          <>
            <SubTabButton
              active={subTab === "received"}
              onClick={() => setSubTab("received")}
              label="Received"
              count={followersReceived.length}
            />
            <SubTabButton
              active={subTab === "accepted"}
              onClick={() => setSubTab("accepted")}
              label="Accepted"
              count={followersAccepted.length}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === "collaborations" && (
          <div className="col-span-full mb-2 p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
            <h2 className="text-lg font-black text-gray-900 mb-1">
              {subTab === "received"
                ? "Received Requests"
                : subTab === "invites_rec"
                  ? "Incoming Invitations"
                  : subTab === "sent"
                    ? "Sent Requests"
                    : subTab === "invites_sent"
                      ? "Sent Invitations"
                      : subTab === "ongoing"
                        ? "Ongoing Collaborations"
                        : "Finished Collaborations"}
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              {subTab === "received" &&
                "This is specifically for researchers applying for a spot on your project team. You are the lead here."}
              {subTab === "invites_rec" &&
                "These are incoming invitations from other leads asking you to join their project"}
              {subTab === "sent" &&
                "These are your applications to join someone elses project team"}
              {subTab === "invites_sent" &&
                "These are the recruitment invitations you have sent to other users for joining your project team"}
              {subTab === "ongoing" &&
                "These remain for your active research collaborations."}
              {subTab === "finished" &&
                "These remain for your completed research collaborations."}
            </p>
          </div>
        )}
        {renderContent()}
      </div>

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        variant={modalConfig.variant}
      />

      <UserProfileModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        universityID={selectedUserID}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projectID={selectedProjectID}
      />
    </div>
  );
}

function NetworkCard({ user, type, onAction, onViewProfile }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-amu-green/30 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="relative h-16 w-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-gray-50">
          <Image
            src={user.avatar}
            alt={user.name}
            fill
            className="object-cover"
          />
        </div>
        <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-black text-gray-900 group-hover:text-amu-green transition-colors">
          {user.name}
        </h3>
        <p className="text-sm font-bold text-amu-green mb-1">{user.role}</p>
        <p className="text-xs font-semibold text-gray-500">{user.department}</p>
      </div>

      <div className="mb-6 h-4" />

      <div className="flex gap-2">
        <button
          onClick={() => onViewProfile(user.universityID || user.id)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-amu-green/5 text-amu-green font-bold rounded-xl hover:bg-amu-green hover:text-white transition-all"
        >
          View Profile
        </button>
        {type === "following" && (
          <button
            onClick={() => onAction(user.id)}
            className="px-4 py-3 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
            title="Unfollow"
          >
            <UserMinus className="h-5 w-5" />
          </button>
        )}
        {type === "follower" && (
          <button
            onClick={() => onAction(user.id)}
            className="px-4 py-3 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
            title="Remove Follower"
          >
            <UserMinus className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}

function CollaborationCard({ collab, onLeave, onViewProfile, onViewProject }) {
  const displayTeam = collab.team.slice(0, 2);
  const hasMore = collab.team.length > 2;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-amu-green/30 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Briefcase className="h-16 w-16 text-amu-green" />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative h-12 w-12 rounded-xl overflow-hidden shadow-md border-2 border-white">
          <Image
            src={collab.avatar}
            alt={collab.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4
            onClick={() => onViewProject(collab.projectId)}
            className="font-bold text-gray-900 leading-tight line-clamp-1 group-hover:text-amu-green transition-colors cursor-pointer"
          >
            {collab.name}
          </h4>
          <div className="mt-1 space-y-0.5">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Creator:{" "}
              <span className="text-gray-700 normal-case font-bold">
                {collab.creator}
              </span>
            </p>
            {collab.team.length > 0 && (
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Team:{" "}
                <span className="text-amu-green normal-case font-bold">
                  {displayTeam.map((name, idx) => (
                    <React.Fragment key={idx}>
                      <span
                        onClick={() => onViewProfile(collab.teamIDs[idx])}
                        className="cursor-pointer hover:underline"
                      >
                        {name}
                      </span>
                      {idx < displayTeam.length - 1 ? ", " : ""}
                    </React.Fragment>
                  ))}
                  {hasMore && ` +${collab.team.length - 2} others`}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <Clock className="h-3 w-3" />
          {new Date(collab.createdAt).toLocaleDateString()}
        </div>
        <span
          className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${
            collab.status === "ACTIVE"
              ? "bg-amu-green/10 text-amu-green border-amu-green/20"
              : collab.status === "COMPLETED"
                ? "bg-blue-50 text-blue-500 border-blue-100"
                : "bg-amu-gold/5 text-amu-gold border-amu-gold/10"
          }`}
        >
          {collab.status.replace("_", " ")}
        </span>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/projects/${collab.projectId}`}
          className="flex-1 py-3 bg-amu-green/5 text-amu-green font-bold text-xs rounded-xl hover:bg-amu-green hover:text-white transition-all text-center"
        >
          Project Details
        </Link>
        {!collab.isCreatorMe && (
          <button
            onClick={onLeave}
            className="px-4 py-3 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
            title="Stop Collaborating"
          >
            <UserMinus className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}

function CollabRequestCard({
  request,
  type,
  onAction,
  onViewProfile,
  onViewProject,
}) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-amu-green/30 transition-all group">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative h-14 w-14 rounded-2xl overflow-hidden shadow-md border-2 border-white text-transparent bg-gray-50">
          <Image
            src={request.avatar}
            alt={type === "received" ? request.from : request.to}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4
              onClick={() => onViewProject(request.projectId)}
              className="font-bold text-gray-900 leading-tight cursor-pointer hover:text-amu-green transition-colors"
            >
              {request.name}
            </h4>
            <span
              className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-md border ${
                request.isInvite
                  ? "bg-amu-gold/10 text-amu-gold border-amu-gold/20"
                  : "bg-blue-50 text-blue-500 border-blue-100"
              }`}
            >
              {request.isInvite ? "Invite" : "Request"}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {type === "received" ? "From " : "To "}
            <span
              onClick={() =>
                onViewProfile(
                  type === "received" ? request.senderID : request.receiverID,
                )
              }
              className="font-bold text-amu-green cursor-pointer hover:underline"
            >
              {type === "received" ? request.from : request.to}
            </span>
          </p>
        </div>
        {type === "sent" && (
          <div className="px-3 py-1 bg-amu-gold/10 text-amu-gold text-[10px] font-black uppercase tracking-widest rounded-lg">
            {request.status}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {type === "received" ? (
          <>
            <button
              onClick={() => onAction(request.id, "accept")}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-amu-green text-white font-bold rounded-xl hover:bg-amu-green/90 transition-all shadow-lg shadow-amu-green/10"
            >
              <Check className="h-4 w-4" />
              Accept
            </button>
            <button
              onClick={() => onAction(request.id, "reject")}
              className="flex items-center justify-center p-3 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </>
        ) : (
          <button
            onClick={() => onAction(request.id, "cancel")}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-500 font-bold rounded-xl hover:bg-gray-100 transition-all"
          >
            Cancel Request
          </button>
        )}
      </div>
    </div>
  );
}

function FollowRequestCard({ request, type, onAction }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-amu-green/30 transition-all group">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative h-14 w-14 rounded-2xl overflow-hidden shadow-md border-2 border-white bg-gray-50">
          <Image
            src={request.avatar}
            alt={request.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 leading-tight">
            {request.name}
          </h4>
          <p className="text-xs font-semibold text-gray-500">
            {request.department}
          </p>
          <p className="text-[10px] font-bold text-amu-green uppercase tracking-wider mt-1">
            {request.role}
          </p>
        </div>
        {type === "sent" && (
          <div className="px-3 py-1 bg-amu-gold/10 text-amu-gold text-[10px] font-black uppercase tracking-widest rounded-lg">
            {request.status}
          </div>
        )}
      </div>

      <div className="mb-6 h-1" />

      <div className="flex gap-2">
        {type === "received" ? (
          <>
            <button
              onClick={() => onAction(request.id, "accept", "received")}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-amu-green text-white font-bold rounded-xl hover:bg-amu-green/90 transition-all shadow-lg shadow-amu-green/10"
            >
              <Check className="h-4 w-4" />
              Accept
            </button>
            <button
              onClick={() => onAction(request.id, "reject", "received")}
              className="flex items-center justify-center p-3 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </>
        ) : (
          <button
            onClick={() => onAction(request.id, "cancel", "sent")}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-500 font-bold rounded-xl hover:bg-gray-100 transition-all"
          >
            Cancel Request
          </button>
        )}
      </div>
    </div>
  );
}

function SubTabButton({ active, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
        active
          ? "bg-amu-green text-white shadow-lg shadow-amu-green/20"
          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
      }`}
    >
      {label} ({count})
    </button>
  );
}
