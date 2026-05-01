"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { GraduationCap, LogOut, User as UserIcon } from "lucide-react";
import { clearCurrentUser } from "@/lib/utils/auth";

const AppNavbar = () => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [user, setUser] = useState(null);

  const fetchUser = () => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser(d.user);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchUser();
    window.addEventListener("user-updated", fetchUser);
    return () => window.removeEventListener("user-updated", fetchUser);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-100 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-amu-green/10 rounded-xl border border-amu-green/20">
          <GraduationCap className="h-6 w-6 text-amu-green" />
        </div>
        <span className="font-extrabold text-xl tracking-tighter text-gray-900">
          AMU <span className="text-amu-green">AcadNet</span>
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-gray-100 pr-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-gray-900 leading-none mb-1">
              {user?.name || (user === null ? "Guest" : "Loading...")}
            </p>
            <p className="text-[10px] font-bold text-amu-green uppercase tracking-widest">
              {isAdmin && user?.role === "ADMIN"
                ? "Admin"
                : user?.role || (user === null ? "GUEST" : "USER")}
            </p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 overflow-hidden shadow-sm">
            {user?.profilePhoto &&
            user.profilePhoto !== "/default-avatar.svg" ? (
              <Image
                src={
                  user.profilePhoto.match(/\.[a-zA-Z0-9]+$/)
                    ? user.profilePhoto
                    : `${user.profilePhoto}.jpg`
                }
                alt={user.name || "User"}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="h-6 w-6" />
            )}
          </div>
        </div>

        {user ? (
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              clearCurrentUser();
              window.location.href = "/login";
            }}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-sm"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        ) : (
          <button
            onClick={() => {
              window.location.href = "/login";
            }}
            className="flex items-center gap-2 px-4 py-2 bg-amu-green text-white hover:bg-green-800 rounded-xl transition-all font-bold text-sm shadow-lg shadow-amu-green/20"
          >
            <UserIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Login</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default AppNavbar;
