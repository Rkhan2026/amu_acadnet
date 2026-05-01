"use client";
import React, { useState } from "react";
import { Users, Briefcase, UserCheck } from "lucide-react";
import NetworkLayout from "@/components/network/NetworkLayout";
import { useNetworkData } from "@/hooks/useNetworkData";
import { useNetworkModals } from "@/hooks/useNetworkModals";

export default function NetworkPage() {
  const {
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
  } = useNetworkData();

  const [activeTab, setActiveTab] = useState("following");
  const [subTab, setSubTab] = useState("accepted");

  const { handlers, modals } = useNetworkModals(
    executeFollowAction,
    executeUnfollow,
    executeCollabAction,
  );

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

  return (
    <NetworkLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      subTab={subTab}
      setSubTab={setSubTab}
      tabs={tabs}
      loading={loading}
      onReload={fetchNetworkData}
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
      modals={modals}
    />
  );
}
