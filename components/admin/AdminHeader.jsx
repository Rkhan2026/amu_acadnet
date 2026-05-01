import React from "react";

const AdminHeader = ({
  title,
  description,
  tabs,
  activeTab,
  onTabChange,
  counts,
}) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div>
      <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
        {title}
      </h1>
      <p className="text-gray-500 mt-2 font-medium">{description}</p>
    </div>

    {/* Tab Switcher */}
    <div className="flex bg-white p-1.5 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeTab === tab.value
              ? "bg-amu-green text-white shadow-lg shadow-amu-green/20"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
          }`}
        >
          {tab.label}
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === tab.value
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {counts[tab.value]}
          </span>
        </button>
      ))}
    </div>
  </div>
);

export default AdminHeader;
