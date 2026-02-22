"use client";
import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  Calendar,
  User,
  Type,
  Users,
  ShieldCheck,
  Search,
} from "lucide-react";
import { PENDING_PUBLICATIONS, PENDING_VERIFICATIONS } from "@/lib/dummyData";

const ProjectCard = ({ project, onAction }) => (
  <div className="bg-white p-8 rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in slide-in-from-right-4 duration-500 hover:border-amu-green/30 transition-all group">
    <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
      <div className="flex gap-6 items-start">
        <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-amu-green/5 transition-colors">
          <BookOpen className="h-8 w-8 text-amu-green" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-black text-gray-900 leading-tight">
            {project.title}
          </h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-500 font-medium text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {project.author}
            </div>
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              {project.domain || project.type}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {project.year}
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              Submitted: {project.submittedAt}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
        <button
          onClick={() => onAction(project.id, "approve")}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-amu-green text-white font-bold rounded-2xl hover:bg-amu-green/90 transition-all shadow-lg shadow-amu-green/20"
        >
          <CheckCircle2 className="h-5 w-5" />
          Approve
        </button>
        <button
          onClick={() => onAction(project.id, "reject")}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <XCircle className="h-5 w-5" />
          Reject
        </button>
      </div>
    </div>
  </div>
);

const AccountCard = ({ account, onAction }) => (
  <div className="bg-white p-8 rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in slide-in-from-right-4 duration-500 hover:border-blue-500/30 transition-all group">
    <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
      <div className="flex gap-6 items-start">
        <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
          <Users className="h-8 w-8 text-blue-500" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-black text-gray-900 leading-tight">
            {account.name}
          </h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-500 font-medium text-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              {account.role}
            </div>
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              ID: {account.universityId}
            </div>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              {account.department}
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              Applied: {account.appliedAt}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
        <button
          onClick={() => onAction(account.id, "approve")}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
        >
          <CheckCircle2 className="h-5 w-5" />
          Verify
        </button>
        <button
          onClick={() => onAction(account.id, "reject")}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <XCircle className="h-5 w-5" />
          Reject
        </button>
      </div>
    </div>
  </div>
);

export default function ModerationPage() {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState(PENDING_PUBLICATIONS);
  const [accounts, setAccounts] = useState(PENDING_VERIFICATIONS);

  const handleProjAction = (id, _action) => {
    setProjects((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAccAction = (id, _action) => {
    setAccounts((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
          Admin Moderation
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Manage institutional data integrity and account verifications.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-100 pb-0">
        <button
          onClick={() => setActiveTab("projects")}
          className={`pb-4 px-2 flex items-center gap-2 font-bold transition-all relative ${
            activeTab === "projects"
              ? "text-amu-green"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <BookOpen className="h-5 w-5" />
          Research Projects
          <span className="bg-amu-green/10 text-amu-green px-2 py-0.5 rounded-lg text-xs">
            {projects.length}
          </span>
          {activeTab === "projects" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amu-green rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("accounts")}
          className={`pb-4 px-2 flex items-center gap-2 font-bold transition-all relative ${
            activeTab === "accounts"
              ? "text-blue-500"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Users className="h-5 w-5" />
          Account Verification
          <span className="bg-blue-50 text-blue-500 px-2 py-0.5 rounded-lg text-xs">
            {accounts.length}
          </span>
          {activeTab === "accounts" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full" />
          )}
        </button>
      </div>

      <div className="space-y-6">
        {activeTab === "projects" ? (
          projects.length > 0 ? (
            projects.map((proj) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                onAction={handleProjAction}
              />
            ))
          ) : (
            <EmptyState
              icon={BookOpen}
              title="All caught up!"
              description="No pending research projects to review."
            />
          )
        ) : accounts.length > 0 ? (
          accounts.map((acc) => (
            <AccountCard
              key={acc.id}
              account={acc}
              onAction={handleAccAction}
            />
          ))
        ) : (
          <EmptyState
            icon={Users}
            title="All accounts verified"
            description="No pending user verification requests."
          />
        )}
      </div>
    </div>
  );
}

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-20 rounded-4xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
    <div className="p-6 bg-gray-50 rounded-3xl mb-6">
      <Icon size={48} className="text-gray-300" />
    </div>
    <h3 className="text-2xl font-black text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 font-medium">{description}</p>
  </div>
);
