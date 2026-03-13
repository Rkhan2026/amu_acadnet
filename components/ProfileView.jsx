"use client";
import React from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Building2,
  Briefcase,
  GraduationCap,
  Edit3,
  BookOpen,
  Clock,
} from "lucide-react";

const ProfileView = ({ user, onEdit }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Not updated recently";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Profile Header Card */}
      <div className="bg-white rounded-4xl p-8 lg:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <GraduationCap className="h-32 w-32 text-amu-green" />
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-3xl overflow-hidden border-4 border-white shadow-xl">
            <Image
              src={user.avatar}
              alt={user.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                  {user.name}
                </h1>
              </div>
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-6 py-3 bg-amu-green text-white font-bold rounded-2xl hover:bg-amu-green/90 transition-all shadow-lg shadow-amu-green/20"
              >
                <Edit3 className="h-5 w-5" />
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 text-gray-600 font-medium">
                <div className="p-2 bg-gray-50 rounded-xl">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                {user.designation}
              </div>
              <div className="flex items-center gap-3 text-gray-600 font-medium">
                <div className="p-2 bg-gray-50 rounded-xl">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                {user.department}
              </div>
              <div className="flex items-center gap-3 text-gray-600 font-medium">
                <div className="p-2 bg-gray-50 rounded-xl">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                </div>
                ID: {user.universityId}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* About / Biography */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-4xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-amu-green/10 rounded-xl">
                <User className="h-5 w-5 text-amu-green" />
              </div>
              Biography
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {user.biography}
            </p>
          </div>

          <div className="bg-white rounded-4xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-amu-gold/10 rounded-xl">
                <BookOpen className="h-5 w-5 text-amu-gold" />
              </div>
              Research Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.researchInterests
                .split(",")
                .slice(0, 1)
                .map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gray-50 text-gray-700 font-bold rounded-xl border border-gray-100 hover:border-amu-green/30 hover:bg-amu-green/5 transition-all cursor-default"
                  >
                    {interest.trim()}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-8">
          <div className="bg-white rounded-4xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6">
              Status & Contact
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <Mail className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Email Address
                  </p>
                  <p className="font-bold text-gray-900">
                    {user.handle.replace("@", "")}@amu.ac.in
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-amu-green/5 rounded-2xl">
                  <Clock className="h-6 w-6 text-amu-green" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Last Updated
                  </p>
                  <p className="font-bold text-gray-900 text-sm">
                    {formatDate(user.lastUpdated)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
