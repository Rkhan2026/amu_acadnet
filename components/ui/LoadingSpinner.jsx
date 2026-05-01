"use client";
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({
  fullPage = false,
  message = "Loading...",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <Loader2 className={`${currentSize} text-amu-green animate-spin`} />
        <div
          className={`absolute inset-0 ${currentSize} text-amu-green opacity-20 animate-ping rounded-full border-2 border-amu-green`}
        />
      </div>
      {message && (
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
