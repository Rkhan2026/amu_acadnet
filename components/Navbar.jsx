"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, GraduationCap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleScroll = (e, href) => {
    // Only prevent default and scroll if we are already on the home page
    if (pathname === "/") {
      e.preventDefault();
      const targetId = href.replace(/.*\#/, "");
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
        // Update URL hash without causing a jump
        window.history.pushState(null, "", `#${targetId}`);
      }
    }
    // Otherwise, let the default Link behavior handle navigation to the home page + hash
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-amu-green" />
              <span className="font-bold text-xl tracking-tight text-gray-900">
                AMU AcadNet
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8 ml-auto">
            <Link
              href="/#features"
              onClick={(e) => handleScroll(e, "#features")}
              className="text-gray-600 hover:text-amu-green transition-colors font-medium"
            >
              Features
            </Link>
            <Link
              href="/#about"
              onClick={(e) => handleScroll(e, "#about")}
              className="text-gray-600 hover:text-amu-green transition-colors font-medium"
            >
              About
            </Link>
            <Link
              href="/login"
              className="px-5 py-2 text-gray-700 font-medium hover:text-amu-green transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 bg-amu-green hover:bg-[#004d26] text-white rounded-full font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-1"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-amu-green p-2 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden bg-white border-t border-gray-100 shadow-xl"
        >
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link
              href="/#features"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amu-green hover:bg-amu-green/10"
              onClick={(e) => {
                toggleMenu();
                handleScroll(e, "#features");
              }}
            >
              Features
            </Link>
            <Link
              href="/#about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amu-green hover:bg-amu-green/10"
              onClick={(e) => {
                toggleMenu();
                handleScroll(e, "#about");
              }}
            >
              About
            </Link>
            <Link
              href="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amu-green hover:bg-amu-green/10"
              onClick={toggleMenu}
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="block w-full text-center mt-4 px-5 py-3 bg-amu-green hover:bg-[#004d26] text-white rounded-lg font-medium transition-all shadow-md"
              onClick={toggleMenu}
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};
export default Navbar;
