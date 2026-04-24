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
} from "lucide-react";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import ConfirmationModal from "@/components/ConfirmationModal";

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
      id: f.followingID,
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
      id: f.followingID,
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
      id: f.followerID,
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
      id: f.followID,
      name: f.follower.name,
      department: f.follower.department,
      avatar: "/default-avatar.svg",
      role: "USER",
      status: "PENDING",
      appliedAt: new Date(f.createdAt).toLocaleDateString(),
      followers: f.follower.followers?.length || 0,
      mutualConnections: 0,
    }));

  const collabOngoing = [
    ...networkData.sentCollaborations
      .filter(
        (c) =>
          c.requestStatus === "ACCEPTED" &&
          c.project?.projectStatus !== "COMPLETED",
      )
      .map((c) => ({
        id: c.requestID,
        projectId: c.projectID,
        name: c.project?.title || "Project",
        partners: [c.receiver?.name || "Member"],
        avatar: "/default-avatar.svg",
        status: c.project?.projectStatus || "ACTIVE",
      })),
    ...networkData.receivedCollaborations
      .filter(
        (c) =>
          c.requestStatus === "ACCEPTED" &&
          c.project?.projectStatus !== "COMPLETED",
      )
      .map((c) => ({
        id: c.requestID,
        projectId: c.projectID,
        name: c.project?.title || "Project",
        partners: [c.sender?.name || "Member"],
        avatar: "/default-avatar.svg",
        status: c.project?.projectStatus || "ACTIVE",
      })),
  ];

  const collabFinished = [
    ...networkData.sentCollaborations
      .filter(
        (c) =>
          c.requestStatus === "ACCEPTED" &&
          c.project?.projectStatus === "COMPLETED",
      )
      .map((c) => ({
        id: c.requestID,
        projectId: c.projectID,
        name: c.project?.title || "Project",
        partners: [c.receiver?.name || "Member"],
        avatar: "/default-avatar.svg",
        status: "COMPLETED",
      })),
    ...networkData.receivedCollaborations
      .filter(
        (c) =>
          c.requestStatus === "ACCEPTED" &&
          c.project?.projectStatus === "COMPLETED",
      )
      .map((c) => ({
        id: c.requestID,
        projectId: c.projectID,
        name: c.project?.title || "Project",
        partners: [c.sender?.name || "Member"],
        avatar: "/default-avatar.svg",
        status: "COMPLETED",
      })),
  ];

  const collabReceived = networkData.receivedCollaborations
    .filter((c) => c.requestStatus === "PENDING")
    .map((c) => ({
      id: c.requestID,
      name: c.project?.title || "Project",
      from: c.sender?.name,
      avatar: "/default-avatar.svg",
      status: "PENDING",
    }));

  const collabSent = networkData.sentCollaborations
    .filter((c) => c.requestStatus === "PENDING")
    .map((c) => ({
      id: c.requestID,
      name: c.project?.title || "Project",
      to: c.receiver?.name,
      avatar: "/default-avatar.svg",
      status: "PENDING",
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
        collabSent.length,
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
          ? followingAccepted.map((u) => (
              <NetworkCard
                key={u.id}
                user={u}
                type="following"
                onAction={handleUnfollowRequest}
              />
            ))
          : followingSent.map((u) => (
              <FollowRequestCard
                key={u.id}
                request={u}
                type="sent"
                onAction={handleFollowRequest}
              />
            ));
      case "followers":
        return subTab === "accepted"
          ? followersAccepted.map((u) => (
              <NetworkCard
                key={u.id}
                user={u}
                type="follower"
                onAction={(id) => handleUnfollowRequest(id, true)}
              />
            ))
          : followersReceived.map((u) => (
              <FollowRequestCard
                key={u.id}
                request={u}
                type="received"
                onAction={handleFollowRequest}
              />
            ));
      case "collaborations":
        if (subTab === "ongoing")
          return collabOngoing.map((c) => (
            <CollaborationCard
              key={c.id}
              collab={c}
              onLeave={() => handleLeaveCollaboration(c.id)}
            />
          ));
        if (subTab === "finished")
          return collabFinished.map((c) => (
            <CollaborationCard
              key={c.id}
              collab={c}
              onLeave={() => handleLeaveCollaboration(c.id)}
            />
          ));

        if (subTab === "received")
          return collabReceived.map((r) => (
            <CollabRequestCard
              key={r.id}
              request={r}
              type="received"
              onAction={handleCollabRequest}
            />
          ));
        if (subTab === "sent")
          return collabSent.map((r) => (
            <CollabRequestCard
              key={r.id}
              request={r}
              type="sent"
              onAction={handleCollabRequest}
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
              active={subTab === "sent"}
              onClick={() => setSubTab("sent")}
              label="Sent"
              count={collabSent.length}
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
    </div>
  );
}

function NetworkCard({ user, type, onAction }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-amu-green/30 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="relative h-16 w-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
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

      <div className="flex items-center gap-2 mb-6 text-gray-400">
        <Users className="h-4 w-4" />
        <p className="text-[10px] font-bold uppercase tracking-wider">
          {type === "following"
            ? `${user.mutualConnections} Mutual Connections`
            : `${user.followers} Followers`}
        </p>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-amu-green/5 text-amu-green font-bold rounded-xl hover:bg-amu-green hover:text-white transition-all">
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

function CollaborationCard({ collab, onLeave }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-amu-green/30 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Briefcase className="h-16 w-16 text-amu-green" />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative h-12 w-12 rounded-xl overflow-hidden shadow-md border-2 border-white">
          <Image
            src={collab.avatar}
            alt={collab.partners.join(", ")}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <Link href={`/projects/${collab.projectId}`}>
            <h4 className="font-bold text-gray-900 leading-tight line-clamp-1 group-hover:text-amu-green transition-colors cursor-pointer">
              {collab.name}
            </h4>
          </Link>
          <p className="text-sm text-gray-500">
            with{" "}
            <span className="font-bold text-amu-green">
              {collab.partners.join(" & ")}
            </span>
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Project Status
        </p>
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
        <button
          onClick={onLeave}
          className="px-4 py-3 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
          title="Stop Collaborating"
        >
          <UserMinus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function CollabRequestCard({ request, type, onAction }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-amu-green/30 transition-all group">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative h-14 w-14 rounded-2xl overflow-hidden shadow-md border-2 border-white text-transparent">
          <Image
            src={request.avatar}
            alt={type === "received" ? request.from : request.to}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 leading-tight">
            {request.name}
          </h4>
          <p className="text-sm text-gray-500">
            {type === "received" ? "From " : "To "}
            <span className="font-bold text-amu-green">
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

      <div className="mb-6 p-3 bg-gray-100/50 rounded-2xl border border-gray-100 italic text-sm text-gray-600">
        &quot;Interested in collaborating on {request.name.toLowerCase()}{" "}
        research...&quot;
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
        <div className="relative h-14 w-14 rounded-2xl overflow-hidden shadow-md border-2 border-white">
          <Image
            src={request.avatar}
            alt={request.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 leading-tight group-hover:text-amu-green transition-colors">
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

      <div className="mb-6 flex items-center gap-2 text-gray-400">
        <span className="text-[10px] font-black uppercase tracking-widest">
          {type === "received" ? "Applied:" : "Sent:"}
        </span>
        <span className="text-xs font-bold text-gray-600">
          {type === "received" ? request.appliedAt : "Today"}
        </span>
      </div>

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
