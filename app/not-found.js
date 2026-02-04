"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Construction, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24 min-h-[80vh]">
      {" "}
      {/* Ensure decent height for centering */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="p-6 bg-amu-green/10 rounded-full">
            <Construction className="h-20 w-20 text-amu-green" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4"
        >
          Development Still Ongoing Here
        </motion.h1>

        {/* Description removed as requested */}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-amu-green hover:bg-[#004d26] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amu-green gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Return Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
