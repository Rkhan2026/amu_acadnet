import React from "react";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

const StatsCard = ({ title, value, icon: Icon, trend, color, href }) => {
  const CardContent = (
    <div className="bg-white p-5 lg:p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 flex items-start justify-between gap-3 h-full hover:border-amu-green/30 transition-all cursor-pointer group overflow-hidden">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 group-hover:text-amu-green/60 transition-colors leading-tight break-words">
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
        className={`p-3 lg:p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform shrink-0`}
      >
        <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
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

export default StatsCard;
