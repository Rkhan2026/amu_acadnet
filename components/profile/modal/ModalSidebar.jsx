import React from "react";
import {
  Mail,
  Users,
  Award,
  BookOpen,
  UserPlus,
  UserMinus,
  Loader2,
  Calendar,
} from "lucide-react";
import Button from "@/components/ui/Button";

const ModalSidebar = ({
  user,
  followingStatus,
  followLoading,
  isOwnProfile,
  isAdmin,
  isGuest,
  onFollow,
  onUnfollow,
  onInvite,
  formatDate,
}) => {
  const interests = user.academicProfile?.interestsSkills || [];

  return (
    <div className="space-y-8">
      {!isOwnProfile && !isAdmin && !isGuest && (
        <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-2xl shadow-gray-200/50 space-y-4">
          {followingStatus === "ACCEPTED" ? (
            <Button
              variant="outline"
              className="w-full py-5 rounded-2xl border-2 text-red-500 border-red-500/10 hover:bg-red-50 hover:border-red-500/20 transition-all font-black uppercase tracking-widest text-[11px]"
              onClick={onUnfollow}
              disabled={followLoading}
            >
              {followLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <UserMinus className="h-4 w-4" /> Unfollow
                </>
              )}
            </Button>
          ) : followingStatus === "PENDING" ? (
            <Button
              variant="outline"
              className="w-full py-5 rounded-2xl border-2 text-amu-gold border-amu-gold/10 hover:bg-red-50 hover:text-red-500 hover:border-red-500/20 transition-all font-black uppercase tracking-widest text-[11px] group"
              onClick={onUnfollow}
              disabled={followLoading}
            >
              {followLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span className="group-hover:hidden flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-pulse" /> Follow Request
                    Sent
                  </span>
                  <span className="hidden group-hover:flex items-center gap-2">
                    <UserMinus className="h-4 w-4" /> Cancel Request
                  </span>
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="primary"
              className="w-full py-5 rounded-2xl bg-amu-green text-white shadow-xl shadow-amu-green/20 hover:shadow-amu-green/40 hover:-translate-y-0.5 transition-all font-black uppercase tracking-widest text-[11px]"
              onClick={onFollow}
              disabled={followLoading}
            >
              {followLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <UserPlus className="h-4 w-4" /> Follow User
                </>
              )}
            </Button>
          )}
          <Button
            variant="secondary"
            className="w-full py-5 rounded-2xl bg-amu-gold text-white shadow-xl shadow-amu-gold/20 hover:shadow-amu-gold/40 hover:-translate-y-0.5 transition-all font-black uppercase tracking-widest text-[11px]"
            onClick={onInvite}
          >
            <Users className="h-4 w-4" /> Invite to Project
          </Button>
        </div>
      )}

      <div className="bg-white p-10 rounded-4xl border border-gray-100 shadow-2xl shadow-gray-200/50 space-y-12">
        <div>
          <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Mail className="h-5 w-5 text-amu-green" /> Contact Information
          </h4>
          <p className="text-gray-900 font-black text-lg break-all bg-gray-50 p-6 rounded-3xl border border-gray-100/50">
            {user.email}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Award className="h-5 w-5 text-amu-gold" /> Stats
          </h4>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-6 bg-amu-green/5 rounded-3xl border border-amu-green/10 flex items-center justify-between group hover:bg-amu-green/10 transition-colors">
              <div>
                <p className="text-[10px] font-black text-amu-green/60 uppercase tracking-widest mb-1">
                  Followers
                </p>
                <p className="text-3xl font-black text-amu-green group-hover:scale-110 transition-transform origin-left">
                  {user._count?.followers || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-amu-green/20" />
            </div>

            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-center justify-between group hover:bg-blue-100 transition-colors">
              <div>
                <p className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest mb-1">
                  Projects
                </p>
                <p className="text-3xl font-black text-blue-600 group-hover:scale-110 transition-transform origin-left">
                  {user._count?.createdProjects || 0}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600/20" />
            </div>

            <div className="p-6 bg-purple-50 rounded-3xl border border-purple-100 flex items-center justify-between group hover:bg-purple-100 transition-colors">
              <div>
                <p className="text-[10px] font-black text-purple-600/60 uppercase tracking-widest mb-1">
                  Collaborations
                </p>
                <p className="text-3xl font-black text-purple-600 group-hover:scale-110 transition-transform origin-left">
                  {(user.workingProjects || []).filter(
                    (p) => p.universityID !== user.universityID,
                  ).length || 0}
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-600/20" />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amu-green" /> Interests
          </h4>
          <div className="flex flex-wrap gap-3">
            {interests.map((interest, idx) => (
              <span
                key={idx}
                className="px-5 py-2.5 bg-amu-green text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-amu-green/10 hover:shadow-amu-green/30 transition-all cursor-default"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-10 border-t border-gray-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-xl text-amu-green">
              <Calendar className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">
                Member Since
              </span>
              <span className="text-gray-900 text-sm font-black uppercase tracking-widest">
                {formatDate(user.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalSidebar;
