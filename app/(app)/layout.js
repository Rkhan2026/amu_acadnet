"use client";
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { PanelLeftOpen } from "lucide-react";

export default function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main
        className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}
      >
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-6 left-6 z-[60] bg-white p-3 rounded-2xl shadow-xl border border-gray-100 text-amu-green hover:bg-amu-green hover:text-white transition-all animate-in fade-in zoom-in duration-300 group"
          >
            <PanelLeftOpen className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </button>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
