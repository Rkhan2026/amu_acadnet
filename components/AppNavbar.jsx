"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { GraduationCap, LogOut, User as UserIcon } from "lucide-react";

const AppNavbar = () => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser(d.user);
      })
      .catch(console.error);
  }, []);

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
              {isAdmin && user?.role === "ADMIN"
                ? user?.name
                : user?.name || "Loading..."}
            </p>
            <p className="text-[10px] font-bold text-amu-green uppercase tracking-widest">
              {isAdmin && user?.role === "ADMIN"
                ? "Admin"
                : user?.role || "USER"}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
            <UserIcon className="h-5 w-5" />
          </div>
        </div>

        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-sm"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AppNavbar;
