"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, ChevronRight, Crown, Users } from "lucide-react";
import Image from "next/image";

const TeamModal = ({ isOpen, onClose, project, onProfileClick }) => {
  if (!project) return null;

  const teamMembers = project.teamMembers || project.team || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amu-green/10 rounded-xl">
                  <Users className="h-5 w-5 text-amu-green" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 leading-tight">
                    Research Team
                  </h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                    {project.title}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6">
              {/* Creator */}
              <section>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">
                  Project Owner
                </p>
                <button
                  onClick={() =>
                    onProfileClick?.(
                      project.universityID || project.creator?.universityID,
                    )
                  }
                  className="w-full flex items-center justify-between group bg-amu-gold/5 p-4 rounded-3xl border border-amu-gold/10 hover:bg-amu-gold/10 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white border border-amu-gold/20 flex items-center justify-center overflow-hidden relative shadow-sm flex-shrink-0">
                      {project.creator?.profilePhoto ? (
                        <Image
                          src={project.creator.profilePhoto}
                          alt={project.creator.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-amu-gold" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm leading-tight group-hover:text-amu-gold transition-colors">
                        {project.creator?.name || project.author}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Crown className="h-3 w-3 text-amu-gold" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-amu-gold">
                          Principal Investigator
                        </p>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amu-gold opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                </button>
              </section>

              {/* Members */}
              <section>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">
                  Collaborators ({teamMembers.length})
                </p>
                {teamMembers.length > 0 ? (
                  <div className="space-y-3">
                    {teamMembers.map((member, i) => (
                      <button
                        key={i}
                        onClick={() => onProfileClick?.(member.universityID)}
                        className="w-full flex items-center justify-between group hover:bg-gray-50 p-3 rounded-2xl transition-all text-left border border-transparent hover:border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full border border-gray-100 shadow-sm overflow-hidden relative bg-white flex-shrink-0">
                            <Image
                              src={
                                member.profilePhoto ||
                                member.avatar ||
                                "/default-avatar.svg"
                              }
                              alt={member.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm leading-tight group-hover:text-amu-green transition-colors">
                              {member.name}
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">
                              {member.role || "Researcher"}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-sm font-bold text-gray-400 italic">
                      No additional collaborators.
                    </p>
                  </div>
                )}
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 text-center">
              <button
                onClick={onClose}
                className="w-full py-4 bg-white text-gray-900 font-black rounded-2xl hover:bg-gray-100 transition-all text-xs uppercase tracking-widest border border-gray-200 shadow-sm"
              >
                Close Team View
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TeamModal;
