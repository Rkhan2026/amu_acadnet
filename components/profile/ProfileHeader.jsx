import React, { memo } from "react";
import Image from "next/image";
import { User, Briefcase, Building2, GraduationCap, Edit3 } from "lucide-react";

const ProfileHeader = memo(({ user, onEdit, setModalImage }) => {
  return (
    <div className="bg-white rounded-4xl p-8 lg:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <GraduationCap className="h-32 w-32 text-amu-green" />
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
        <div
          className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => {
            if (user.profilePhoto) setModalImage(user.profilePhoto);
          }}
        >
          {user.profilePhoto ? (
            <Image
              src={
                user.profilePhoto.match(/\.[a-zA-Z0-9]+$/)
                  ? user.profilePhoto
                  : `${user.profilePhoto}.jpg`
              }
              alt={user.name || "User"}
              fill
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <User className="w-16 h-16" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
              {user.name || "Academic Researcher"}
            </h1>
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-6 py-3 bg-amu-green text-white font-bold rounded-2xl hover:bg-amu-green/90 transition-all shadow-lg shadow-amu-green/20"
            >
              <Edit3 className="h-5 w-5" />
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3 text-gray-600 font-medium capitalize">
              <div className="p-2 bg-gray-50 rounded-xl">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              {user.designation || user.role || "Researcher"}
            </div>
            <div className="flex items-center gap-3 text-gray-600 font-medium">
              <div className="p-2 bg-gray-50 rounded-xl">
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
              {user.department || "General Academics"}
            </div>
            <div className="flex items-center gap-3 text-gray-600 font-medium">
              <div className="p-2 bg-gray-50 rounded-xl">
                <GraduationCap className="h-5 w-5 text-gray-400" />
              </div>
              ID: {user.universityID || user.universityId || "N/A"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
        <div className="text-center group-hover:bg-gray-50 p-4 rounded-3xl transition-all border-r border-gray-100">
          <p className="text-2xl lg:text-3xl font-black text-amu-green">
            {user.stats?.projects || 0}
          </p>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Projects Created
          </p>
        </div>
        <div className="text-center group-hover:bg-gray-50 p-4 rounded-3xl transition-all">
          <p className="text-2xl lg:text-3xl font-black text-blue-500">
            {
              Object.keys(
                [
                  ...(user.sentCollaborations || []),
                  ...(user.receivedCollaborations || []),
                ].reduce((acc, c) => {
                  if (c.project.universityID !== user.universityID)
                    acc[c.project.projectID] = true;
                  return acc;
                }, {}),
              ).length
            }
          </p>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Collaborations
          </p>
        </div>
      </div>
    </div>
  );
});

ProfileHeader.displayName = "ProfileHeader";
export default ProfileHeader;
