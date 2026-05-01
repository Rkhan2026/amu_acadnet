"use client";
import React, { useState } from "react";
import { Users, Briefcase, UserCheck } from "lucide-react";
import NetworkLayout from "@/components/network/NetworkLayout";
import { useNetworkData } from "@/hooks/useNetworkData";

export default function NetworkPage() {
  const {
    loading,
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
  } = useNetworkData();

  const [activeTab, setActiveTab] = useState("following");
  const [subTab, setSubTab] = useState("accepted");
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

  const handlers = {
    onFollowAction: (id, action, type) => {
      if (action === "reject")
        setModalConfig({
          isOpen: true,
          title: "Reject Follow Request?",
          message: "Are you sure you want to reject this request?",
          confirmText: "Reject",
          variant: "danger",
          onConfirm: () => executeFollowAction(id, "reject", type),
        });
      else executeFollowAction(id, action, type);
    },
    onUnfollowRequest: (targetID, isFollower = false) => {
      setModalConfig({
        isOpen: true,
        title: isFollower ? "Remove Follower?" : "Unfollow Researcher?",
        message: isFollower
          ? "Are you sure you want to remove this follower?"
          : "Are you sure you want to unfollow this researcher?",
        confirmText: isFollower ? "Remove" : "Unfollow",
        variant: "danger",
        onConfirm: () =>
          executeUnfollow(targetID, isFollower ? "follower" : "following"),
      });
    },
    onCollabAction: (requestID, action) => {
      if (action === "reject")
        setModalConfig({
          isOpen: true,
          title: "Reject Collaboration?",
          message: "Are you sure you want to reject this request?",
          confirmText: "Reject",
          variant: "danger",
          onConfirm: () => executeCollabAction(requestID, "reject"),
        });
      else executeCollabAction(requestID, action);
    },
    onLeaveCollab: (requestID) =>
      setModalConfig({
        isOpen: true,
        title: "Stop Collaborating?",
        message:
          "Are you sure you want to stop collaborating? This cannot be undone.",
        confirmText: "Stop Collaborating",
        variant: "danger",
        onConfirm: () => executeCollabAction(requestID, "cancel"),
      }),
    onViewProfile: openProfile,
    onViewProject: openProject,
  };

  return (
    <NetworkLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      subTab={subTab}
      setSubTab={setSubTab}
      tabs={tabs}
      loading={loading}
      data={{
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
      }}
      handlers={handlers}
      modals={{
        config: modalConfig,
        onClose: closeModal,
        isUserModalOpen,
        onUserModalClose: () => setIsUserModalOpen(false),
        selectedUserID,
        isProjectModalOpen,
        onProjectModalClose: () => setIsProjectModalOpen(false),
        selectedProjectID,
        onViewProfile: openProfile,
      }}
    />
  );
}
