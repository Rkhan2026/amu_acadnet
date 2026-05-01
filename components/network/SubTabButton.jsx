import React from "react";

export default function SubTabButton({ active, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 flex items-center gap-2 ${
        active
          ? "bg-amu-green/10 border-amu-green text-amu-green shadow-sm"
          : "bg-gray-50 border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100"
      }`}
    >
      {label}
      {count > 0 && (
        <span
          className={`px-1.5 py-0.5 rounded-md text-[10px] ${
            active ? "bg-amu-green text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
