"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <div
      id="about"
      className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 overflow-hidden bg-white scroll-mt-24"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-linear-to-b from-amu-green/5 to-white">
        <div className="absolute -top-[20%] -right-[10%] w-150 h-150 rounded-full bg-amu-green/10 blur-[100px]" />
        <div className="absolute top-[40%] -left-[10%] w-100 h-100 rounded-full bg-amu-gold/10 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge removed as requested */}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1]"
          >
            Connect. Collaborate. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amu-green to-amu-gold">
              Innovate Together.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            AMU AcadNet is the exclusive academic social network for Aligarh
            Muslim University. Discover researchers, manage verified profiles,
            and foster interdisciplinary collaboration under institutional
            governance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-amu-green hover:bg-[#004d26] text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-amu-green/30 flex items-center justify-center gap-2"
            >
              Join AcadNet <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 hover:border-amu-green/30 hover:bg-amu-green/5 rounded-full font-bold text-lg transition-all shadow-sm hover:shadow-md"
            >
              Learn More
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: ShieldCheck,
                title: "Verified Profiles",
                desc: "Authentic academic identities managed by the institution.",
              },
              {
                icon: Sparkles,
                title: "AI Recommendations",
                desc: "Smart matching for interdisciplinary research opportunities.",
              },
              {
                icon: Globe,
                title: "Institutional Network",
                desc: "Controlled environment for focused academic growth.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 hover:border-amu-green/30 transition-colors group flex flex-col items-center text-center"
              >
                <item.icon className="h-8 w-8 text-amu-green mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1 text-justify">
                  {item.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
