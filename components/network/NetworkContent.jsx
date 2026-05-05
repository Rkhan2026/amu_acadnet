import React from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import NetworkCard from "./NetworkCard";
import CollaborationCard from "./CollaborationCard";
import FollowRequestCard from "./FollowRequestCard";
import CollabRequestCard from "./CollabRequestCard";
import { Clock, Briefcase } from "lucide-react";

const EmptyState = ({ message, subMessage, icon: Icon = Clock }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in duration-500">
    <div className="w-20 h-20 rounded-[2rem] bg-gray-50 flex items-center justify-center mb-6 border border-gray-100 shadow-sm">
      <Icon className="w-10 h-10 text-gray-300" />
    </div>
    <h3 className="text-xl font-black text-gray-900 mb-2">{message}</h3>
    <p className="text-gray-500 font-medium max-w-md mx-auto">{subMessage}</p>
  </div>
);

const NetworkContent = ({
  loading,
  processingId,
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
    const list =
      subTab === "accepted" ? data.followingAccepted : data.followingSent;
    if (list.length === 0) {
      return (
        <EmptyState
          message={
            subTab === "accepted"
              ? "Not following anyone yet"
              : "No pending follow requests"
          }
          subMessage={
            subTab === "accepted"
              ? "Explore researchers and scholars to start building your academic network."
              : "Your sent follow requests will appear here once you start connecting."
          }
        />
      );
    }

    return list.map((u, i) =>
      subTab === "accepted" ? (
        <NetworkCard
          key={u.id || `fa-${i}`}
          user={u}
          type="following"
          onAction={onUnfollowRequest}
          onViewProfile={onViewProfile}
          isProcessing={processingId === u.universityID}
        />
      ) : (
        <FollowRequestCard
          key={u.id || `fs-${i}`}
          request={u}
          type="sent"
          onAction={onFollowAction}
          onViewProfile={onViewProfile}
          isProcessing={processingId === u.universityID}
        />
      ),
    );
  }

  if (activeTab === "followers") {
    const list =
      subTab === "accepted" ? data.followersAccepted : data.followersReceived;
    if (list.length === 0) {
      return (
        <EmptyState
          message={
            subTab === "accepted"
              ? "No followers yet"
              : "No follow requests received"
          }
          subMessage={
            subTab === "accepted"
              ? "Collaborate on projects and share your work to attract academic followers."
              : "When other researchers want to follow you, you'll see their requests here."
          }
        />
      );
    }

    return list.map((u, i) =>
      subTab === "accepted" ? (
        <NetworkCard
          key={u.id || `aa-${i}`}
          user={u}
          type="follower"
          onAction={(id) => onUnfollowRequest(id, true)}
          onViewProfile={onViewProfile}
          isProcessing={processingId === u.universityID}
        />
      ) : (
        <FollowRequestCard
          key={u.id || `ar-${i}`}
          request={u}
          type="received"
          onAction={onFollowAction}
          onViewProfile={onViewProfile}
          isProcessing={processingId === u.id}
        />
      ),
    );
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

  if (list.length === 0) {
    return (
      <EmptyState
        message={`No ${subTab.replace("_", " ")} found`}
        subMessage="Your collaboration activities and history will be tracked here."
        icon={Briefcase}
      />
    );
  }

  return list.map((c, i) =>
    subTab === "ongoing" || subTab === "finished" ? (
      <CollaborationCard
        key={c.id || `co-${i}`}
        collab={c}
        onLeave={() => onLeaveCollab(c.id)}
        onViewProfile={onViewProfile}
        onViewProject={onViewProject}
        isProcessing={processingId === c.id}
      />
    ) : (
      <CollabRequestCard
        key={c.id || `cr-${i}`}
        request={c}
        type={subTab.includes("sent") ? "sent" : "received"}
        onAction={onCollabAction}
        onViewProfile={onViewProfile}
        onViewProject={onViewProject}
        isProcessing={processingId === c.id}
      />
    ),
  );
};

export default NetworkContent;
