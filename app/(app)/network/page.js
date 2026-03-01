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
} from "lucide-react";
import {
  FOLLOWING,
  FOLLOWERS,
  COLLABORATIONS,
  COLLABORATION_REQUESTS_RECEIVED,
  COLLABORATION_REQUESTS_SENT,
  FOLLOW_REQUESTS_RECEIVED,
  FOLLOW_REQUESTS_SENT,
} from "@/lib/dummyData";

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState("following");
  const [subTab, setSubTab] = useState("accepted");

  const tabs = [
    {
      id: "following",
      label: "Following",
      count: FOLLOWING.length + FOLLOW_REQUESTS_SENT.length,
      icon: UserCheck,
    },
    {
      id: "followers",
      label: "Followers",
      count: FOLLOWERS.length + FOLLOW_REQUESTS_RECEIVED.length,
      icon: Users,
    },
    {
      id: "collaborations",
      label: "Collaborations",
      count:
        COLLABORATIONS.length +
        COLLABORATION_REQUESTS_RECEIVED.length +
        COLLABORATION_REQUESTS_SENT.length,
      icon: Briefcase,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "following":
        if (subTab === "accepted") {
          return FOLLOWING.map((u) => (
            <NetworkCard key={u.id} user={u} type="following" />
          ));
        } else if (subTab === "sent") {
          return FOLLOW_REQUESTS_SENT.map((u) => (
            <FollowRequestCard key={u.id} request={u} type="sent" />
          ));
        } else {
          return [];
        }
      case "followers":
        if (subTab === "accepted") {
          return FOLLOWERS.map((u) => (
            <NetworkCard key={u.id} user={u} type="followers" />
          ));
        } else if (subTab === "received") {
          return FOLLOW_REQUESTS_RECEIVED.map((u) => (
            <FollowRequestCard key={u.id} request={u} type="received" />
          ));
        } else {
          return [];
        }
      case "collaborations":
        if (subTab === "accepted") {
          return COLLABORATIONS.map((c) => (
            <CollaborationCard key={c.id} collab={c} />
          ));
        } else {
          const requests =
            subTab === "received"
              ? COLLABORATION_REQUESTS_RECEIVED
              : COLLABORATION_REQUESTS_SENT;
          return requests.map((r) => (
            <CollabRequestCard key={r.id} request={r} type={subTab} />
          ));
        }
      default:
        return null;
    }
  };

  return (
    <div className="py-8 px-4 md:px-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header section */}
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

      {/* Main Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-100 pb-0 overflow-x-auto scroller-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSubTab("accepted");
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

      {/* Sub-tabs Rendering */}
      <div className="flex gap-3 mb-8">
        {activeTab === "collaborations" ? (
          <>
            <SubTabButton
              active={subTab === "received"}
              onClick={() => setSubTab("received")}
              label="Received"
              count={COLLABORATION_REQUESTS_RECEIVED.length}
            />
            <SubTabButton
              active={subTab === "sent"}
              onClick={() => setSubTab("sent")}
              label="Sent"
              count={COLLABORATION_REQUESTS_SENT.length}
            />
            <SubTabButton
              active={subTab === "accepted"}
              onClick={() => setSubTab("accepted")}
              label="Accepted"
              count={COLLABORATIONS.length}
            />
          </>
        ) : activeTab === "following" ? (
          <>
            <SubTabButton
              active={subTab === "sent"}
              onClick={() => setSubTab("sent")}
              label="Sent"
              count={FOLLOW_REQUESTS_SENT.length}
            />
            <SubTabButton
              active={subTab === "accepted"}
              onClick={() => setSubTab("accepted")}
              label="Accepted"
              count={FOLLOWING.length}
            />
          </>
        ) : (
          <>
            <SubTabButton
              active={subTab === "received"}
              onClick={() => setSubTab("received")}
              label="Received"
              count={FOLLOW_REQUESTS_RECEIVED.length}
            />
            <SubTabButton
              active={subTab === "accepted"}
              onClick={() => setSubTab("accepted")}
              label="Accepted"
              count={FOLLOWERS.length}
            />
          </>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderContent()}
      </div>
    </div>
  );
}

function NetworkCard({ user, type }) {
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

      <button className="w-full flex items-center justify-center gap-2 py-3 bg-amu-green/5 text-amu-green font-bold rounded-xl hover:bg-amu-green hover:text-white transition-all">
        View Profile
      </button>
    </div>
  );
}

function CollaborationCard({ collab }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-amu-green/30 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Briefcase className="h-16 w-16 text-amu-green" />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative h-12 w-12 rounded-xl overflow-hidden shadow-md border-2 border-white">
          <Image
            src={collab.avatar}
            alt={collab.partner}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 leading-tight line-clamp-1">
            {collab.name}
          </h4>
          <p className="text-sm text-gray-500">
            with{" "}
            <span className="font-bold text-amu-green">
              {collab.partners.join(" & ")}
            </span>
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-end text-xs font-bold mb-2">
          <span className="text-amu-green">{collab.progress}%</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-amu-green rounded-full transition-all duration-1000"
            style={{ width: `${collab.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function CollabRequestCard({ request, type }) {
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
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-amu-green text-white font-bold rounded-xl hover:bg-amu-green/90 transition-all shadow-lg shadow-amu-green/10">
              <Check className="h-4 w-4" />
              Accept
            </button>
            <button className="flex items-center justify-center p-3 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
              <X className="h-5 w-5" />
            </button>
          </>
        ) : (
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-500 font-bold rounded-xl hover:bg-gray-100 transition-all">
            Cancel Request
          </button>
        )}
      </div>
    </div>
  );
}

function FollowRequestCard({ request, type }) {
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
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-amu-green text-white font-bold rounded-xl hover:bg-amu-green/90 transition-all shadow-lg shadow-amu-green/10">
              <Check className="h-4 w-4" />
              Accept
            </button>
            <button className="flex items-center justify-center p-3 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
              <X className="h-5 w-5" />
            </button>
          </>
        ) : (
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-500 font-bold rounded-xl hover:bg-gray-100 transition-all">
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
