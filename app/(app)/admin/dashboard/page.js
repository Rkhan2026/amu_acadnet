"use client";
import React from "react";
import {
  Users,
  ShieldCheck,
  FileCheck,
  BookOpen,
  TrendingUp,
  PieChart,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";

const StatsCard = ({ title, value, icon: Icon, trend, color, href }) => {
  const CardContent = (
    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 flex items-start justify-between h-full hover:border-amu-green/30 transition-all cursor-pointer group">
      <div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-amu-green/60 transition-colors">
          {title}
        </p>
        <h3 className="text-3xl font-black text-gray-900">{value}</h3>
        {trend && (
          <div className="flex items-center gap-1 mt-2 text-amu-green bg-amu-green/10 w-fit px-2 py-1 rounded-lg">
            <TrendingUp className="h-3 w-3" />
            <span className="text-xs font-black">{trend}</span>
          </div>
        )}
      </div>
      <div
        className={`p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform`}
      >
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {CardContent}
    </Link>
  ) : (
    CardContent
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setStats(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <LoadingSpinner fullPage message="Loading institutional analytics..." />
    );
  if (!stats)
    return (
      <div className="py-20 text-center text-red-400 font-medium font-black uppercase tracking-widest text-xs tracking-widest text-xs">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-8 rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-amu-green/10 rounded-xl">
                <PieChart className="h-5 w-5 text-amu-green" />
              </div>
              Academic Profile Distribution
            </h3>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Institutional Composition
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.profileDistribution.map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-amu-green/20 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-xs font-black text-gray-400 uppercase tracking-tighter">
                    {item.label}
                  </span>
                </div>
                <div className="text-2xl font-black text-gray-900">
                  {item.value}
                </div>
                <div className="mt-2 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        stats.totalUsers > 0
                          ? `${(item.value / stats.totalUsers) * 100}%`
                          : "0%",
                    }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
