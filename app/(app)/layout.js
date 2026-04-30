"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import AppNavbar from "@/components/AppNavbar";
import { PanelLeftOpen, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push("/login");
        } else {
          setUser(data.user);
          setLoading(false);
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  useEffect(() => {
    fetchUser();
    window.addEventListener("user-updated", fetchUser);
    return () => window.removeEventListener("user-updated", fetchUser);
  }, [fetchUser]);

  if (loading) return <LoadingSpinner fullPage message="Verifying access..." />;

  if (user?.accountStatus === "REJECTED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md text-center border border-gray-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-100">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
            Access Denied
          </h2>
          <p className="text-gray-500 mb-8 font-medium">
            You cannot access the dashboard without your status being approved.
            Please update your profile.
          </p>
          <button
            onClick={() => router.push("/resubmit-profile")}
            className="w-full py-4 bg-amu-green text-white font-black rounded-2xl hover:bg-green-800 transition-all shadow-lg shadow-amu-green/20"
          >
            Update Profile
          </button>
        </div>
      </div>
    );
  }

  if (user?.accountStatus === "PENDING") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md text-center border border-gray-100">
          <div className="w-20 h-20 bg-amu-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-amu-gold/20">
            <Loader2 className="h-10 w-10 text-amu-gold animate-spin" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
            Approval Pending
          </h2>
          <p className="text-gray-500 mb-8 font-medium">
            Your account is still awaiting administrator approval. Please check
            back later.
          </p>
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              router.push("/login");
            }}
            className="w-full py-4 bg-amu-green text-white font-black rounded-2xl hover:bg-green-800 transition-all shadow-lg shadow-amu-green/20"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <AppNavbar />

      <div className="flex pt-16">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main
          className={`flex-1 min-h-[calc(100vh-64px)] transition-all duration-300 ease-in-out ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}
        >
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="fixed top-[5.5rem] left-6 z-[60] bg-white p-3 rounded-2xl shadow-xl border border-gray-100 text-amu-green hover:bg-amu-green hover:text-white transition-all animate-in fade-in zoom-in duration-300 group"
            >
              <PanelLeftOpen className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </button>
          )}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
