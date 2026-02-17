"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bell, User, Users, PanelLeftClose } from "lucide-react";

const Sidebar = ({ isOpen, onToggle }) => {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Explore", href: "/explore", icon: Search },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Network", href: "/network", icon: Users },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <aside
      className={`fixed left-0 top-16 z-50 h-[calc(100vh-64px)] bg-white border-r border-gray-100 transition-all duration-300 ease-in-out flex flex-col ${
        isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"
      }`}
    >
      <div className="md:hidden p-4 border-b border-gray-50 flex items-center justify-end">
        <button
          onClick={onToggle}
          className="p-2 text-gray-400 hover:text-amu-green hover:bg-gray-50 rounded-xl transition-all"
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
