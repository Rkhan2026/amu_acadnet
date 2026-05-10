import React from "react";
import SubTabButton from "./SubTabButton";

const NetworkSubTabs = ({ activeTab, subTab, setSubTab, counts }) => (
  <div className="flex gap-3 mb-8 overflow-x-auto scroller-hide">
    {activeTab === "collaborations" ? (
      [
        { id: "ongoing", label: "Ongoing", count: counts.collabOngoing },
        { id: "finished", label: "Finished", count: counts.collabFinished },
        {
          id: "received",
          label: "Received Requests",
          count: counts.collabReceived,
        },
        {
          id: "invites_rec",
          label: "Invites Received",
          count: counts.collabInvitesReceived,
        },
        { id: "sent", label: "Sent", count: counts.collabSent },
        {
          id: "invites_sent",
          label: "Invites Sent",
          count: counts.collabInvitesSent,
        },
      ].map((tab) => (
        <SubTabButton
          key={tab.id}
          active={subTab === tab.id}
          onClick={() => setSubTab(tab.id)}
          label={tab.label}
          count={tab.count}
        />
      ))
    ) : activeTab === "following" ? (
      <>
        <SubTabButton
          active={subTab === "accepted"}
          onClick={() => setSubTab("accepted")}
          label="Following"
          count={counts.followingAccepted}
        />
        <SubTabButton
          active={subTab === "sent"}
          onClick={() => setSubTab("sent")}
          label="Requested"
          count={counts.followingSent}
        />
      </>
    ) : (
      <>
        <SubTabButton
          active={subTab === "accepted"}
          onClick={() => setSubTab("accepted")}
          label="My Followers"
          count={counts.followersAccepted}
        />
        <SubTabButton
          active={subTab === "received"}
          onClick={() => setSubTab("received")}
          label="New Requests"
          count={counts.followersReceived}
        />
      </>
    )}
  </div>
);

export default NetworkSubTabs;
