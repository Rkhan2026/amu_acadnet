import React from "react";
import { motion } from "framer-motion";
import { PieChart } from "lucide-react";

const DistributionGrid = ({ items, totalUsers }) => (
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-amu-green/20 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-widest">
              {item.label}
            </span>
          </div>
          <div className="text-2xl font-black text-gray-900">{item.value}</div>
          <div className="mt-2 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width:
                  totalUsers > 0 ? `${(item.value / totalUsers) * 100}%` : "0%",
              }}
              transition={{ duration: 1, delay: idx * 0.1 }}
              className={`h-full ${item.color}`}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DistributionGrid;
