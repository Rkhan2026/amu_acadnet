import React from "react";

const Badge = ({
  children,
  variant = "default",
  className = "",
  icon: Icon,
  ...props
}) => {
  const variants = {
    default: "bg-gray-50 text-gray-600 border-gray-100",
    success: "bg-amu-green/10 text-amu-green border-amu-green/20",
    primary: "bg-amu-green text-white border-amu-green",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
    error: "bg-red-50 text-red-600 border-red-100",
    gold: "bg-amu-gold/10 text-amu-gold border-amu-gold/20",
    dark: "bg-gray-900 text-white border-gray-900",
  };

  const baseStyles =
    "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl border flex items-center gap-2 shadow-sm transition-all";

  return (
    <span
      className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
};

export default Badge;
