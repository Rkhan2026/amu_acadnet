import React from "react";

const Section = ({
  title,
  icon: Icon,
  children,
  className = "",
  variant = "white",
}) => {
  const variants = {
    white: "bg-white border-gray-100",
    gray: "bg-gray-50 border-gray-100",
  };

  return (
    <div
      className={`rounded-[3rem] p-10 lg:p-14 shadow-sm border transition-all ${variants[variant] || variants.white} ${className}`}
    >
      {title && (
        <div className="flex items-center gap-3 mb-8">
          {Icon && (
            <div className="w-10 h-10 bg-amu-green/10 rounded-xl flex items-center justify-center">
              <Icon className="h-5 w-5 text-amu-green" />
            </div>
          )}
          <h2 className="text-2xl font-black text-gray-900">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
};

export default Section;
