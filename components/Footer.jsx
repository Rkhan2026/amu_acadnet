"use client";
import React from "react";
import { GraduationCap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-amu-green" />
              <span className="font-bold text-xl tracking-tight">
                AMU AcadNet
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed text-justify">
              An Institutional Academic Social Network and Collaboration System
              tailored for Aligarh Muslim University to foster innovation and
              research.
            </p>
          </div>

          {/* <div>
            <h4 className="font-bold text-lg mb-4 text-amu-green">Platform</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#why-us"
                  className="hover:text-white transition-colors"
                >
                  Why Us
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-white transition-colors"
                >
                  Join Now
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-amu-green">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  User Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Research Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-amu-green">Contact</h4>
            
          </div> */}
        </div>

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
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
