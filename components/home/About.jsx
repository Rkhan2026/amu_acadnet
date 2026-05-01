"use client";
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";

const aims = [
  "Centralized platform for managing official academic profiles.",
  "Encourage intra-departmental and interdisciplinary collaboration.",
  "Introduce controlled academic networking under institutional governance.",
  "AI-based collaboration recommendations based on interests.",
  "Ensure authenticity through moderation and verification.",
];

const comparisons = [
  {
    platform: "Public Platforms (ResearchGate)",
    gap: "Lack institutional governance and moderated official records.",
    solution:
      "AMU AcadNet operates entirely under institutional control for verified data.",
  },
  {
    platform: "Research Info Systems (Elsevier Pure)",
    gap: "Primarily for reporting; lacks social networking and collaboration discovery.",
    solution:
      "Introduces interactive networking and AI-driven researcher discovery.",
  },
  {
    platform: "Repository Systems (DSpace)",
    gap: "Document-centric and passive; no collaboration mechanisms.",
    solution:
      "Focuses on active engagement and AI-assisted collaboration suggestions.",
  },
];

const About = () => {
  return (
    <section id="about" className="py-24 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Project Aims */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-amu-green font-black tracking-[0.2em] uppercase text-sm mb-4">
              Mission & Aims
            </h2>
            <h3 className="text-4xl font-black text-gray-900 mb-8 leading-tight">
              Bridging the gap in{" "}
              <span className="text-amu-green">Institutional</span>{" "}
              Communication.
            </h3>
            <p className="text-lg text-gray-600 mb-8 font-medium leading-relaxed">
              In modern academic institutions, effective collaboration is
              essential for innovation. AMU AcadNet provides a dedicated system
              for verified profile management and structured networking that
              previously relied on fragmented external platforms.
            </p>
            <div className="space-y-4">
              {aims.map((aim, idx) => (
                <div key={idx} className="flex items-start gap-3 group">
                  <div className="mt-1 p-1 rounded-full bg-amu-green/10 text-amu-green group-hover:bg-amu-green group-hover:text-white transition-colors">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <span className="text-gray-700 font-semibold">{aim}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Gap Analysis / Comparisons */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20 capitalize pointer-events-none text-6xl font-black tracking-tighter">
              Aims
            </div>

            <h4 className="text-2xl font-bold mb-8 flex items-center gap-3 text-amu-gold">
              <AlertCircle className="h-7 w-7" />
              Why AMU AcadNet?
            </h4>

            <div className="space-y-8 relative z-10">
              {comparisons.map((item, idx) => (
                <div
                  key={idx}
                  className="border-b border-white/10 pb-6 last:border-0 last:pb-0"
                >
                  <h5 className="text-amu-gold font-bold mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {item.platform}
                  </h5>
                  <p className="text-sm text-gray-400 mb-3 italic">
                    &quot;{item.gap}&quot;
                  </p>
                  <p className="text-sm font-medium text-gray-200">
                    <span className="text-amu-green font-bold">Solution:</span>{" "}
                    {item.solution}
                  </p>
                </div>
              ))}
            </div>

            <motion.div
              animate={{
                rotate: [0, 5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute -bottom-10 -right-10 w-40 h-40 bg-amu-green/20 blur-3xl rounded-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
