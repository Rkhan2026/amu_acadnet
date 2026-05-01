import React from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import NetworkCard from "./NetworkCard";
import CollaborationCard from "./CollaborationCard";
import FollowRequestCard from "./FollowRequestCard";
import CollabRequestCard from "./CollabRequestCard";

const NetworkContent = ({
  loading,
  activeTab,
  subTab,
  data,
  onFollowAction,
  onUnfollowRequest,
  onCollabAction,
  onLeaveCollab,
  onViewProfile,
  onViewProject,
}) => {
  if (loading) {
    return (
      <div className="col-span-full py-20">
        <LoadingSpinner message="Loading network activity..." />
      </div>
    );
  }

  if (activeTab === "following") {
    return subTab === "accepted"
      ? data.followingAccepted.map((u, i) => (
          <NetworkCard
            key={u.id || `fa-${i}`}
            user={u}
            type="following"
            onAction={onUnfollowRequest}
            onViewProfile={onViewProfile}
          />
        ))
      : data.followingSent.map((u, i) => (
          <FollowRequestCard
            key={u.id || `fs-${i}`}
            request={u}
            type="sent"
            onAction={onFollowAction}
            onViewProfile={onViewProfile}
          />
        ));
  }

  if (activeTab === "followers") {
    return subTab === "accepted"
      ? data.followersAccepted.map((u, i) => (
          <NetworkCard
            key={u.id || `aa-${i}`}
            user={u}
            type="follower"
            onAction={(id) => onUnfollowRequest(id, true)}
            onViewProfile={onViewProfile}
          />
        ))
      : data.followersReceived.map((u, i) => (
          <FollowRequestCard
            key={u.id || `ar-${i}`}
            request={u}
            type="received"
            onAction={onFollowAction}
            onViewProfile={onViewProfile}
          />
        ));
  }

  const collabMaps = {
    ongoing: data.collabOngoing,
    finished: data.collabFinished,
    received: data.collabReceived,
    invites_rec: data.collabInvitesReceived,
    sent: data.collabSent,
    invites_sent: data.collabInvitesSent,
  };
  const list = collabMaps[subTab] || [];

  return list.map((c, i) =>
    subTab === "ongoing" || subTab === "finished" ? (
      <CollaborationCard
        key={c.id || `co-${i}`}
        collab={c}
        onLeave={() => onLeaveCollab(c.id)}
        onViewProfile={onViewProfile}
        onViewProject={onViewProject}
      />
    ) : (
      <CollabRequestCard
        key={c.id || `cr-${i}`}
        request={c}
        type={subTab.includes("sent") ? "sent" : "received"}
        onAction={onCollabAction}
        onViewProfile={onViewProfile}
        onViewProject={onViewProject}
      />
    ),
  );
};

export default NetworkContent;
