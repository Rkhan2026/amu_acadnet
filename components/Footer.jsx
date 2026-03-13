"use client";
import React from "react";
import { GraduationCap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-8 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} AMU AcadNet. All rights reserved.
          </p>
          <p className="mt-2">
            Created by{" "}
            <a
              href="https://github.com/Rkhan2026"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amu-green hover:text-white transition-colors font-medium"
            >
              Mohd Rameez Khan
            </a>{" "}
            as part of{" "}
            <a
              href="https://github.com/Rkhan2026/amu_acadnet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amu-green hover:text-white transition-colors font-medium"
            >
              CAMS-4D01 Dissertation Project
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
