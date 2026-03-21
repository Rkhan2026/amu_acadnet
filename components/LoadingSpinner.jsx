"use client";
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ fullPage = false, message = "Loading..." }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <Loader2 className="h-12 w-12 text-amu-green animate-spin" />
        <div className="absolute inset-0 h-12 w-12 text-amu-green opacity-20 animate-ping rounded-full border-2 border-amu-green" />
      </div>
      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">
        {message}
      </p>
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
