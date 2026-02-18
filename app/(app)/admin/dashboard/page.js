"use client";
import React from "react";
import {
  Users,
  ShieldCheck,
  FileCheck,
  BookOpen,
  TrendingUp,
  BarChart3,
  PieChart,
} from "lucide-react";
import Link from "next/link";
import { ADMIN_STATS, ANALYTICS_DATA } from "@/lib/dummyData";
import { motion } from "framer-motion";

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
          value={ADMIN_STATS.totalUsers}
          icon={Users}
          color="bg-blue-50 text-blue-500"
        />
        <StatsCard
          title="Pending User Verifications"
          value={ADMIN_STATS.pendingVerifications}
          icon={ShieldCheck}
          color="bg-amu-gold/10 text-amu-gold"
          href="/admin/verifications"
          trend="+12%" // Restored TrendingUp icon by adding a trend prop
        />
        <StatsCard
          title="Total Publications"
          value={ADMIN_STATS.totalPublications}
          icon={BookOpen}
          color="bg-amu-green/10 text-amu-green"
        />
        <StatsCard
          title="Pending Research Publication Moderations"
          value={ADMIN_STATS.pendingModerations}
          icon={FileCheck}
          color="bg-purple-50 text-purple-500"
          href="/admin/moderation"
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
            {ANALYTICS_DATA.profileDistribution.map((item, idx) => (
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
                    animate={{ width: `${(item.value / 1240) * 100}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Research Activity Summary */}
        <div className="bg-white p-8 rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-xl">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              Research Activity Trends
            </h3>
          </div>
          <div className="flex items-end gap-2 h-48 mb-6 px-2">
            {ANALYTICS_DATA.researchActivities.map((data, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-2 group"
              >
                <div className="w-full relative flex items-end justify-center h-full">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.publications / 100) * 100}%` }}
                    className="w-full max-w-6 bg-amu-green rounded-t-lg group-hover:bg-amu-green-light transition-colors relative"
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black text-amu-green">
                      {data.publications}
                    </div>
                  </motion.div>
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {data.month}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 font-medium text-center">
            Monthly institutional research output across all departments.
          </p>
        </div>
      </div>
    </div>
  );
}
