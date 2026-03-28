"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/utils/auth";

const Hero = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // Initial check from localStorage for speed
    const localUser = getCurrentUser();
    if (localUser) setUser(localUser);

    // Verify with API to ensure session is still valid
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser(d.user);
        else setUser(null);
      })
      .catch(() => setUser(null));
  }, []);

  const scrollToFeatures = (e) => {
    e.preventDefault();
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", "#features");
    }
  };

  return (
    <div
      id="about"
      className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden bg-white scroll-mt-24"
    >
      {/* Background decoration - Enhanced with more layers and motion */}
      <div className="absolute inset-0 overflow-hidden -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(0,102,51,0.05),transparent_50%)]">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -right-[5%] w-150 h-150 rounded-full bg-amu-green/20 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[30%] -left-[10%] w-125 h-125 rounded-full bg-amu-gold/15 blur-[100px]"
        />

        {/* Abstract shapes for complexity */}
        <div className="absolute top-1/4 right-1/4 w-px h-64 bg-linear-to-b from-transparent via-amu-green/20 to-transparent rotate-45 transform" />
        <div className="absolute bottom-1/4 left-1/4 w-px h-64 bg-linear-to-b from-transparent via-amu-gold/20 to-transparent -rotate-45 transform" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amu-green/5 border border-amu-green/10 text-amu-green text-sm font-semibold mb-8"
          >
            <Sparkles className="h-4 w-4" />
            <span>The Official Academic Hub of Aligarh Muslim University</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 mb-8 leading-[0.95]"
          >
            Connect. <span className="text-amu-green">Collaborate.</span> <br />
            <motion.span
              className="text-transparent bg-clip-text bg-linear-to-r from-amu-green via-amu-gold to-amu-green bg-size-[200%_auto]"
              animate={{ backgroundPosition: ["0% center", "200% center"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              Innovate Together.
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Empowering the AMU community through a centralized, verified, and
            AI-driven academic ecosystem for research growth and
            interdisciplinary excellence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              href={
                user
                  ? user.role === "ADMIN"
                    ? "/admin/dashboard"
                    : "/home"
                  : "/register"
              }
              className="group relative w-full sm:w-auto px-10 py-5 bg-amu-green text-white rounded-full font-black text-xl transition-all shadow-2xl hover:shadow-amu-green/40 flex items-center justify-center gap-3 overflow-hidden"
            >
              <span className="relative z-10 transition-transform group-hover:-translate-x-1">
                {user ? "Go to Dashboard" : "Join AMU AcadNet"}
              </span>
              <ArrowRight className="h-6 w-6 relative z-10 transition-transform group-hover:translate-x-1" />
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </Link>
            <Link
              href="#features"
              onClick={scrollToFeatures}
              className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 border-2 border-gray-100 hover:border-amu-green/30 hover:bg-amu-green/5 rounded-full font-black text-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              Explore Features
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
