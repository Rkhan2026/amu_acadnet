import React from "react";
import NetworkTabs from "./NetworkTabs";
import NetworkSubTabs from "./NetworkSubTabs";
import NetworkContent from "./NetworkContent";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import UserProfileModal from "@/components/profile/UserProfileModal";
import ProjectModal from "@/components/project/ProjectModal";

import { RefreshCw } from "lucide-react";

const NetworkLayout = ({
  activeTab,
  setActiveTab,
  subTab,
  setSubTab,
  tabs,
  loading,
  processingId,
  onReload,
  data,
  handlers,
  modals,
}) => (
  <div className="py-8 px-4 md:px-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            My Network
          </h1>
          <button
            onClick={onReload}
            disabled={loading}
            className={`p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-amu-gold/10 hover:text-amu-gold transition-all duration-300 group ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`}
            title="Refresh Network"
          >
            <RefreshCw
              className={`w-4 h-4 transition-transform duration-500 ${
                loading ? "animate-spin" : "group-hover:rotate-180"
              }`}
            />
          </button>
        </div>
        <p className="text-gray-500 font-medium">
          Manage your academic connections, follow requests, and research
          collaborations.
        </p>
      </div>
    </div>

    <NetworkTabs
      activeTab={activeTab}
      onTabChange={(id) => {
        setActiveTab(id);
        setSubTab(id === "collaborations" ? "ongoing" : "accepted");
      }}
      tabs={tabs}
    />

    <NetworkSubTabs
      activeTab={activeTab}
      subTab={subTab}
      setSubTab={setSubTab}
      counts={{
        followingAccepted: data.followingAccepted.length,
        followingSent: data.followingSent.length,
        followersAccepted: data.followersAccepted.length,
        followersReceived: data.followersReceived.length,
        collabOngoing: data.collabOngoing.length,
        collabFinished: data.collabFinished.length,
        collabReceived: data.collabReceived.length,
        collabInvitesReceived: data.collabInvitesReceived.length,
        collabSent: data.collabSent.length,
        collabInvitesSent: data.collabInvitesSent.length,
      }}
    />

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activeTab === "collaborations" && (
        <div className="col-span-full mb-2 p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
          <h2 className="text-lg font-black text-gray-900 mb-1 capitalize">
            {subTab === "invites_rec"
              ? "Invites Received"
              : subTab === "received"
                ? "Received Requests"
                : subTab.replace("_", " ")}
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            {subTab === "received" &&
              "Users requesting to collaborate on your projects."}
            {subTab === "invites_rec" &&
              "Invitations from other users to join their projects."}
            {subTab === "sent" &&
              "Your requests to collaborate on other users' projects."}
            {subTab === "invites_sent" &&
              "Your invitations to other users to join your projects."}
            {subTab === "ongoing" &&
              "Track and manage your active research collaborations."}
            {subTab === "finished" &&
              "History of your completed research project collaborations."}
          </p>
        </div>
      )}
      <NetworkContent
        loading={loading}
        processingId={processingId}
        activeTab={activeTab}
        subTab={subTab}
        data={data}
        onFollowAction={handlers.onFollowAction}
        onUnfollowRequest={handlers.onUnfollowRequest}
        onCollabAction={handlers.onCollabAction}
        onLeaveCollab={handlers.onLeaveCollab}
        onViewProfile={handlers.onViewProfile}
        onViewProject={handlers.onViewProject}
      />
    </div>

    <ConfirmationModal
      isOpen={modals.config.isOpen}
      onClose={modals.onClose}
      onConfirm={modals.config.onConfirm}
      title={modals.config.title}
      message={modals.config.message}
      confirmText={modals.config.confirmText}
      variant={modals.config.variant}
    />
    <UserProfileModal
      isOpen={modals.isUserModalOpen}
      onClose={modals.onUserModalClose}
      universityID={modals.selectedUserID}
      zIndex="z-[400]"
    />
    <ProjectModal
      isOpen={modals.isProjectModalOpen}
      onClose={modals.onProjectModalClose}
      projectID={modals.selectedProjectID}
      onProfileClick={modals.onViewProfile}
      zIndex="z-[300]"
    />
  </div>
);

export default NetworkLayout;
