"use client";
import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  Calendar,
  User,
  Type,
  ExternalLink,
  Building2,
  X,
  ArrowLeft
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PENDING_PUBLICATIONS } from "@/lib/dummyData";

const ProjectCard = ({ project, onAction, onClick }) => (
  <div 
    onClick={() => onClick(project)}
    className="bg-white p-8 rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in slide-in-from-right-4 duration-500 hover:border-amu-green/30 transition-all group cursor-pointer"
  >
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
          onClick={(e) => { e.stopPropagation(); onAction(project.id, "approve"); }}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-amu-green text-white font-bold rounded-2xl hover:bg-amu-green/90 transition-all shadow-lg shadow-amu-green/20"
        >
          <CheckCircle2 className="h-5 w-5" />
          Approve
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onAction(project.id, "reject"); }}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <XCircle className="h-5 w-5" />
          Reject
        </button>
      </div>
    </div>
  </div>
);

const ProjectModal = ({ project, onClose, onAction }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-50 w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden my-8"
        >
          <div className="p-8 md:p-14 pb-0 max-h-[85vh] overflow-y-auto custom-scrollbar">
            
            <button 
              onClick={onClose}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold text-sm uppercase tracking-widest mb-10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 pb-14">
              
              {/* Main Content Area */}
              <div className="flex-1 space-y-12">
                {/* Header Information */}
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amu-green/10 text-amu-green">
                      {project.domain}
                    </span>
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700">
                      Pending Approval
                    </span>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight mb-8">
                    {project.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-8 py-4 border-y border-gray-200/60">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Lead Researcher</p>
                        <p className="font-bold text-gray-900">{project.author}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                        <Building2 className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Department</p>
                        <p className="font-bold text-gray-900">{project.department || "Not Specified"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-amu-green/10 rounded-xl flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-amu-green" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">Description</h2>
                  </div>
                  <p className="text-gray-600 font-medium leading-relaxed prose prose-lg max-w-none">
                    {project.description || "No description provided."}
                  </p>
                </div>

                {/* External Links */}
                {project.externalLinks && project.externalLinks.length > 0 && (
                  <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                      <ExternalLink className="h-5 w-5 text-amu-green" />
                      External Links
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.externalLinks.map((link, i) => (
                        <a 
                          key={i}
                          href={link.url || "#"} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center justify-center group hover:border-amu-green transition-all"
                        >
                          <p className="text-gray-500 group-hover:text-amu-green transition-colors truncate text-sm font-medium">
                            {link.url}
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="w-full lg:w-80 shrink-0 space-y-6">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-8">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Execution Status</p>
                  
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400">Submitted At</p>
                      <p className="text-sm font-black text-gray-900">{project.submittedAt}</p>
                    </div>
                  </div>

                  {project.team && project.team.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-gray-50">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Project Team</p>
                      <div className="space-y-6 mb-8">
                        {project.team.map((member, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <Image src={member.avatar} alt={member.name} width={40} height={40} className="rounded-xl border border-gray-100" />
                            <div className="text-left">
                              <p className="font-bold text-gray-900 text-sm leading-tight">{member.name}</p>
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">{member.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 pt-8 border-t border-gray-50">
                    <button
                      onClick={() => { onAction(project.id, "approve"); onClose(); }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-amu-green text-white font-bold rounded-2xl hover:bg-[#004d26] transition-all shadow-xl shadow-amu-green/20"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      Approve Project
                    </button>
                    <button
                      onClick={() => { onAction(project.id, "reject"); onClose(); }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100"
                    >
                      <XCircle className="h-5 w-5" />
                      Reject Project
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function ModerationPage() {
  const [projects, setProjects] = useState(PENDING_PUBLICATIONS);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjAction = (id, _action) => {
    setProjects((prev) => prev.filter((item) => item.id !== id));
    if (selectedProject?.id === id) {
      setSelectedProject(null);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
          Admin Moderation
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Manage institutional data integrity for research projects.
        </p>
      </div>

      <div className="space-y-6">
        {projects.length > 0 ? (
          projects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onClick={setSelectedProject}
              onAction={handleProjAction}
            />
          ))
        ) : (
          <EmptyState
            icon={BookOpen}
            title="All caught up!"
            description="No pending research projects to review."
          />
        )}
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onAction={handleProjAction}
        />
      )}
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
