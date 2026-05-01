"use client";
import React from "react";
import {
  Users,
  ShieldCheck,
  FileCheck,
  BookOpen,
  Handshake,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StatsCard from "@/components/admin/StatsCard";
import DistributionGrid from "@/components/admin/DistributionGrid";

import { useAdminStats } from "@/hooks/useAdminData";

export default function AdminDashboard() {
  const { stats, loading } = useAdminStats();

  if (loading)
    return (
      <LoadingSpinner fullPage message="Loading institutional analytics..." />
    );
  if (!stats)
    return (
      <div className="py-20 text-center text-red-500 font-black uppercase tracking-widest text-[10px]">
        Failed to load analytics.
      </div>
    );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          Institutional Analytics
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Monitoring academic growth and institutional governance at AMU.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-blue-50 text-blue-500"
          href="/admin/verifications?mode=APPROVED"
        />
        <StatsCard
          title="Pending User Verifications"
          value={stats.pendingVerifications}
          icon={ShieldCheck}
          color="bg-amu-gold/10 text-amu-gold"
          href="/admin/verifications?mode=PENDING"
        />
        <StatsCard
          title="Total Research Projects"
          value={stats.totalPublications}
          icon={BookOpen}
          color="bg-amu-green/10 text-amu-green"
          href="/admin/moderation?mode=APPROVED"
        />
        <StatsCard
          title="Pending Research Project Moderations"
          value={stats.pendingModerations}
          icon={FileCheck}
          color="bg-purple-50 text-purple-500"
          href="/admin/moderation?mode=PENDING"
        />
        <StatsCard
          title="Total Collaborations"
          value={stats.totalCollaborations || 0}
          icon={Handshake}
          color="bg-orange-50 text-orange-500"
          href="/admin/collaborations"
        />
      </div>

      <DistributionGrid
        items={stats.profileDistribution}
        totalUsers={stats.totalUsers}
      />
    </div>
  );
}
