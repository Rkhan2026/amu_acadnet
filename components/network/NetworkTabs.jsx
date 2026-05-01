import React from "react";

const NetworkTabs = ({ activeTab, onTabChange, tabs }) => (
  <div className="flex gap-4 mb-8 border-b border-gray-100 pb-0 overflow-x-auto scroller-hide">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`pb-4 px-2 flex items-center gap-2 font-bold transition-all relative whitespace-nowrap ${
          activeTab === tab.id
            ? "text-amu-green"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <tab.icon className="h-5 w-5" />
        {tab.label}
        <span className="bg-amu-green/10 text-amu-green px-2 py-0.5 rounded-lg text-xs">
          {tab.count}
        </span>
        {activeTab === tab.id && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amu-green rounded-t-full" />
        )}
      </button>
    ))}
  </div>
);

export default NetworkTabs;
