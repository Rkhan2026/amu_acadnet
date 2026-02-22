"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Bell,
  User,
  Users,
  PanelLeftClose,
  LayoutDashboard,
  ShieldCheck,
  FileCheck,
  GraduationCap,
  PlusCircle,
} from "lucide-react";

const Sidebar = ({ isOpen, onToggle }) => {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith("/admin");

  const userItems = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Create Project", href: "/projects/create", icon: PlusCircle },
    { label: "Explore", href: "/explore", icon: Search },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Network", href: "/network", icon: Users },
    { label: "Profile", href: "/profile", icon: User },
  ];

  const adminItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Verifications", href: "/admin/verifications", icon: ShieldCheck },
    { label: "Moderation", href: "/admin/moderation", icon: FileCheck },
  ];

  const navItems = isAdminPath ? adminItems : userItems;

  return (
    <aside
      className={`fixed left-0 top-0 z-[110] h-screen bg-white border-r border-gray-100 transition-all duration-300 ease-in-out flex flex-col ${
        isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"
      }`}
    >
      <div className="p-4 border-b border-gray-50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="p-1.5 bg-amu-green/10 rounded-xl border border-amu-green/20 shrink-0">
            <GraduationCap className="h-6 w-6 text-amu-green" />
          </div>
          <span className="font-extrabold text-lg tracking-tighter text-gray-900 truncate">
            AMU <span className="text-amu-green">AcadNet</span>
          </span>
        </div>
        <button
          onClick={onToggle}
          className="p-2 text-gray-400 hover:text-amu-green hover:bg-gray-50 rounded-xl transition-all shrink-0"
        >
          <PanelLeftClose className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-amu-green/10 text-amu-green font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon
                className={`h-5 w-5 ${
                  isActive
                    ? "text-amu-green"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
