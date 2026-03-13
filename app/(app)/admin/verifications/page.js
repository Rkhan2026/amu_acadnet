"use client";
import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  User,
  Building2,
  Clock,
  ArrowLeft,
  Mail,
  GraduationCap,
  BookOpen
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PENDING_VERIFICATIONS } from "@/lib/dummyData";

const VerificationCard = ({ request, onAction, onClick }) => (
  <div 
    onClick={() => onClick(request)}
    className="bg-white p-8 rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in slide-in-from-right-4 duration-500 hover:border-amu-green/30 transition-all cursor-pointer group"
  >
    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
      <div className="flex gap-6 items-center">
        <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-amu-green/5 transition-colors">
          <User className="h-8 w-8 text-gray-400 group-hover:text-amu-green transition-colors" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black text-gray-900">{request.name}</h3>
            <span className="px-3 py-1 bg-amu-gold/10 text-amu-gold text-[10px] font-black uppercase tracking-widest rounded-full border border-amu-gold/20">
              {request.role}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-500 font-medium text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {request.department}
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              ID: {request.universityId}
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="h-4 w-4" />
              {request.appliedAt}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
        <button
          onClick={(e) => { e.stopPropagation(); onAction(request.id, "approve"); }}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-amu-green text-white font-bold rounded-2xl hover:bg-amu-green/90 transition-all shadow-lg shadow-amu-green/20"
        >
          <CheckCircle2 className="h-5 w-5" />
          Verify
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onAction(request.id, "reject"); }}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <XCircle className="h-5 w-5" />
          Reject
        </button>
      </div>
    </div>
  </div>
);

const UserModal = ({ user, onClose, onAction }) => {
  if (!user) return null;

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
          className="bg-gray-50 w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden my-8"
        >
          <div className="p-8 md:p-14 pb-0 max-h-[85vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between mb-10">
              <button 
                onClick={onClose}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold text-sm uppercase tracking-widest transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => { onAction(user.id, "approve"); onClose(); }}
                  className="flex items-center gap-2 px-6 py-3 bg-amu-green text-white font-bold rounded-2xl hover:bg-[#004d26] transition-all shadow-lg shadow-amu-green/20"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Verify Profile
                </button>
                <button
                  onClick={() => { onAction(user.id, "reject"); onClose(); }}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-gray-400 font-bold rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100"
                >
                  <XCircle className="h-5 w-5" />
                  Reject
                </button>
              </div>
            </div>

            <div className="space-y-8 pb-14">
              
              {/* Profile Header Card */}
              <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amu-green/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2.5rem] overflow-hidden bg-gray-50 border-4 border-white shadow-xl shadow-gray-200/50 shrink-0">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={192}
                      height={192}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="text-center md:text-left pt-2 flex-1">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
                      {user.name}
                    </h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 max-w-2xl">
                      <div className="flex items-center justify-center md:justify-start gap-3 text-gray-500 font-medium">
                        <div className="p-2 bg-gray-50 rounded-xl">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        {user.role}
                      </div>
                      
                      <div className="flex items-center justify-center md:justify-start gap-3 text-gray-500 font-medium">
                        <div className="p-2 bg-gray-50 rounded-xl">
                          <Building2 className="h-4 w-4 text-gray-400" />
                        </div>
                        {user.department}
                      </div>
                      
                      <div className="flex items-center justify-center md:justify-start gap-3 text-gray-500 font-medium">
                        <div className="p-2 bg-gray-50 rounded-xl">
                          <GraduationCap className="h-4 w-4 text-gray-400" />
                        </div>
                        ID: {user.universityId}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Bio & Interests */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-amu-green/10 rounded-2xl">
                        <User className="h-6 w-6 text-amu-green" />
                      </div>
                      <h2 className="text-2xl font-black text-gray-900">Biography</h2>
                    </div>
                    <p className="text-gray-600 font-medium leading-relaxed prose prose-lg">
                      {user.biography}
                    </p>
                  </div>

                  <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-amu-gold/10 rounded-2xl">
                        <BookOpen className="h-6 w-6 text-amu-gold" />
                      </div>
                      <h2 className="text-2xl font-black text-gray-900">Research Interests</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {user.researchInterests.map((interest, idx) => (
                        <span key={idx} className="px-5 py-2.5 bg-gray-50 text-gray-600 font-bold text-sm rounded-xl border border-gray-100">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Status & Contact */}
                <div className="space-y-8">
                  <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-black text-gray-900 mb-8">Status & Contact</h2>
                    
                    <div className="space-y-8">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl shrink-0">
                          <Mail className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                          <p className="font-bold text-gray-900 break-all">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-amu-green/10 text-amu-green rounded-2xl shrink-0">
                          <Clock className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Applied For Verification</p>
                          <p className="font-bold text-gray-900">{user.appliedAt}</p>
                        </div>
                      </div>
                    </div>
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

export default function VerificationsPage() {
  const [requests, setRequests] = useState(PENDING_VERIFICATIONS);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleAction = (id, _action) => {
    // In a real app, API call would happen here
    setRequests((prev) => prev.filter((req) => req.id !== id));
    if (selectedUser?.id === id) {
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
          Academic Verifications
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Verify institutional records and academic affiliations for members of
          AMU.
        </p>
      </div>

      <div className="space-y-6">
        {requests.length > 0 ? (
          requests.map((req) => (
            <VerificationCard
              key={req.id}
              request={req}
              onClick={setSelectedUser}
              onAction={handleAction}
            />
          ))
        ) : (
          <div className="bg-white p-20 rounded-4xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="p-6 bg-amu-green/10 rounded-3xl mb-6">
              <CheckCircle2 size={48} className="text-amu-green" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              Queue is Clear!
            </h3>
            <p className="text-gray-500 font-medium">
              All academic profiles have been successfully verified.
            </p>
          </div>
        )}
      </div>

      {selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
}
