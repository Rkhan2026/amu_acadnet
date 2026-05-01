import React, { useState } from "react";
import { RESEARCH_DOMAINS } from "@/lib/utils";

const DomainSelect = ({
  value,
  onChange,
  placeholder = "Select Project Domain",
  className = "",
}) => {
  const [isCustom, setIsCustom] = useState(() => {
    return value && !RESEARCH_DOMAINS.includes(value);
  });

  const handleSelectChange = (e) => {
    const val = e.target.value;
    if (val === "Other") {
      setIsCustom(true);
      onChange("");
    } else {
      setIsCustom(false);
      onChange(val);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <select
        value={isCustom ? "Other" : value}
        onChange={handleSelectChange}
        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-amu-green focus:bg-white rounded-2xl text-sm font-bold text-gray-700 outline-none transition-all appearance-none cursor-pointer shadow-inner"
      >
        <option value="">{placeholder}</option>
        {RESEARCH_DOMAINS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
        <option value="Other">Other (Custom Domain)</option>
      </select>

      {isCustom && (
        <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
          <input
            type="text"
            placeholder="Enter custom domain..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-5 pr-[120px] py-4 bg-white border-2 border-amu-green/20 rounded-2xl text-sm font-bold text-gray-700 outline-none transition-all placeholder:text-gray-400"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-amu-green uppercase tracking-widest bg-amu-green/5 px-2 py-1 rounded-md pointer-events-none">
            Custom
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainSelect;
