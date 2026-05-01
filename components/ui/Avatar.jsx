import React from "react";
import Image from "next/image";
import { User } from "lucide-react";

const Avatar = ({
  src,
  alt = "User avatar",
  size = "md",
  className = "",
  fallbackIcon: FallbackIcon = User,
}) => {
  const sizes = {
    xs: "w-6 h-6",
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
    "2xl": "w-40 h-40",
  };

  const containerSize = sizes[size] || sizes.md;

  return (
    <div
      className={`relative rounded-full overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center flex-shrink-0 ${containerSize} ${className}`}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" />
      ) : (
        <FallbackIcon
          className={`text-gray-400 ${size === "xs" ? "w-3 h-3" : "w-1/2 h-1/2"}`}
        />
      )}
    </div>
  );
};

export default Avatar;
