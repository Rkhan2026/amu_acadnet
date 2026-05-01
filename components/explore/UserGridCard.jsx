import React, { memo } from "react";
import Image from "next/image";
import { Users, Building2, Tag } from "lucide-react";
import { motion } from "framer-motion";

const UserGridCard = memo(({ user, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}
      className="group bg-white p-6 rounded-3xl border border-gray-100 hover:border-amu-green/30 transition-all hover:shadow-2xl hover:shadow-gray-200/50 flex flex-col justify-between cursor-pointer"
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div
            className={`relative h-12 w-12 rounded-2xl overflow-hidden flex items-center justify-center ${user.avatar && user.avatar !== "/default-avatar.svg" ? "" : "bg-blue-50 text-blue-500"}`}
          >
            {user.avatar && user.avatar !== "/default-avatar.svg" ? (
              <Image
                src={
                  user.avatar.match(/\.[a-zA-Z0-9]+$/)
                    ? user.avatar
                    : `${user.avatar}.jpg`
                }
                alt={user.name}
                fill
                className="object-cover"
              />
            ) : (
              <Users className="h-6 w-6" />
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amu-green transition-colors">
          {user.name}
        </h3>

        <div className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {user.interests?.length > 0 ? (
                <>
                  {user.interests.slice(0, 3).map((interest, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-50 text-gray-400 border border-gray-100"
                    >
                      {interest}
                    </span>
                  ))}
                  {user.interests.length > 3 && (
                    <span className="text-[9px] font-bold text-gray-300 self-center">
                      + {user.interests.length - 3} more
                    </span>
                  )}
                </>
              ) : (
                <span className="text-[10px] italic text-gray-300">
                  No interests listed
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-tighter">
            <Building2 className="h-4 w-4 shrink-0" />
            <span className="truncate">{user.department}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-tighter">
            <Tag className="h-4 w-4 shrink-0" />
            <span>{user.role}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

UserGridCard.displayName = "UserGridCard";
export default UserGridCard;
