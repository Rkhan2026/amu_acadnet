"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Users,
  X,
  Check,
  Search,
  MoreVertical,
  Briefcase,
  UserCheck,
  Zap,
} from "lucide-react";
import {
  FOLLOWING,
  FOLLOWERS,
  COLLABORATIONS,
  COLLABORATION_REQUESTS_RECEIVED,
  COLLABORATION_REQUESTS_SENT,
} from "@/lib/dummyData";

const DEPARTMENTS = [
  "Computer Science",
  "Physics",
  "Psychology",
  "Medicine",
  "English",
  "Civil Engineering",
];
const DOMAINS = [
  "AI & ML",
  "Quantum Physics",
  "Sustainability",
  "Mental Health",
  "English Literature",
  "Healthcare AI",
];

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState("following");
  const [requestType, setRequestType] = useState("received"); // "received" or "sent"
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [domainFilter, setDomainFilter] = useState("");

  const tabs = [
    {
      id: "following",
      label: "Following",
      count: FOLLOWING.length,
      icon: UserCheck,
    },
    {
      id: "followers",
      label: "Followers",
      count: FOLLOWERS.length,
      icon: Users,
    },
    {
      id: "collaborations",
      label: "Collaborations",
      count: COLLABORATIONS.length,
      icon: Briefcase,
    },
    {
      id: "requests",
      label: "Collaboration Requests",
      count:
        COLLABORATION_REQUESTS_RECEIVED.length +
        COLLABORATION_REQUESTS_SENT.length,
      icon: Zap,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "following":
        return FOLLOWING.filter((u) => {
          const matchesSearch = u.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          const matchesDept = departmentFilter
            ? u.department === departmentFilter
            : true;
          const matchesDomain = domainFilter ? u.domain === domainFilter : true;
          return matchesSearch && matchesDept && matchesDomain;
        }).map((u) => <NetworkCard key={u.id} user={u} type="following" />);
      case "followers":
        return FOLLOWERS.filter((u) => {
          const matchesSearch = u.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          const matchesDept = departmentFilter
            ? u.department === departmentFilter
            : true;
          const matchesDomain = domainFilter ? u.domain === domainFilter : true;
          return matchesSearch && matchesDept && matchesDomain;
        }).map((u) => <NetworkCard key={u.id} user={u} type="followers" />);
      case "collaborations":
        return COLLABORATIONS.filter((c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ).map((c) => <CollaborationCard key={c.id} collab={c} />);
      case "requests":
        const requests =
          requestType === "received"
            ? COLLABORATION_REQUESTS_RECEIVED
            : COLLABORATION_REQUESTS_SENT;

        return requests
          .filter((r) =>
            r.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .map((r) => (
            <CollabRequestCard key={r.id} request={r} type={requestType} />
          ));
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
            Researcher Discovery
          </h1>
          <p className="text-gray-500 font-medium">
            Discover potential collaborators across departments and domains.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-amu-green transition-colors" />
            <input
              type="text"
              placeholder="Search researchers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amu-green/20 focus:border-amu-green transition-all w-full md:w-64 font-medium"
            />
          </div>

          <div className="flex gap-4">
            <select
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="flex-1 md:flex-none px-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:border-amu-green font-bold text-sm text-gray-700 outline-none cursor-pointer"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              onChange={(e) => setDomainFilter(e.target.value)}
              className="flex-1 md:flex-none px-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:border-amu-green font-bold text-sm text-gray-700 outline-none cursor-pointer"
            >
              <option value="">All Domains</option>
              {DOMAINS.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-100 pb-0 overflow-x-auto scroller-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      {/* Sub-tabs for Requests */}
      {activeTab === "requests" && (
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setRequestType("received")}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
              requestType === "received"
                ? "bg-amu-green text-white shadow-lg shadow-amu-green/20"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
          >
            Received ({COLLABORATION_REQUESTS_RECEIVED.length})
          </button>
          <button
            onClick={() => setRequestType("sent")}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
              requestType === "sent"
                ? "bg-amu-green text-white shadow-lg shadow-amu-green/20"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
          >
            Sent ({COLLABORATION_REQUESTS_SENT.length})
          </button>
        </div>
      )}

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
