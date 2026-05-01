import React from "react";
import { X } from "lucide-react";

const TagInput = ({
  tags,
  onAdd,
  onRemove,
  placeholder = "Add tag...",
  inputValue,
  onInputChange,
  className = "",
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = inputValue.trim();
      if (val) {
        onAdd(val);
        onInputChange("");
      }
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      onRemove(tags.length - 1);
    }
  };

  return (
    <div
      className={`flex flex-wrap gap-2 min-h-[44px] p-2 bg-gray-50 border-2 border-transparent focus-within:border-amu-green focus-within:bg-white rounded-2xl transition-all ${className}`}
    >
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className="flex items-center gap-1 px-3 py-1 bg-amu-green text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm animate-in zoom-in-95 duration-200"
        >
          {tag}
          <button
            onClick={() => onRemove(idx)}
            className="p-0.5 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        placeholder={tags.length === 0 ? placeholder : "Add more..."}
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-gray-700 min-w-[120px] px-2 py-1"
      />
    </div>
  );
};

export default TagInput;
