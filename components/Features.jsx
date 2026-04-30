"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  UserCheck,
  FileText,
  Share2,
  Search,
  BrainCircuit,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: UserCheck,
    title: "Verified Academic Profiles",
    description:
      "Build a trustworthy academic identity with official institutional verification. Showcase your research, designation, and department securely.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered Collaboration",
    description:
      "Leverage AI to find the perfect collaborators based on shared interests and publication history.",
    color: "bg-amu-gold/20 text-amu-gold/90",
  },
  {
    icon: Shield,
    title: "Institutional Governance",
    description:
      "A secure, moderated environment ensuring data authenticity and focusing on genuine academic interactions, unlike public social networks.",
    color: "bg-amu-green/20 text-amu-green",
  },
  {
    icon: Search,
    title: "Advanced Researcher Discovery",
    description:
      "Easily find faculty and scholars across departments. Filter by domain, expertise, and interests to foster interdisciplinary work.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: FileText,
    title: "Research Record Management",
    description:
      "Centralized repository for your publications, projects, and thesis. Keep your academic record organized and officially validated.",
    color: "bg-rose-100 text-rose-600",
  },
  {
    icon: Share2,
    title: "Controlled Networking",
    description:
      "Follow peers and mentors within the university to potentially collaborate with each other.",
    color: "bg-cyan-100 text-cyan-600",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="py-24 bg-gray-50/50 relative overflow-hidden scroll-mt-24"
    >
      {/* Subtle background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-amu-green/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-amu-green font-black tracking-[0.2em] uppercase text-sm mb-4"
          >
            Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight"
          >
            Built for <span className="text-amu-green">Academic</span>{" "}
            Excellence.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 font-medium"
          >
            A comprehensive suite of tools designed exclusively for the unique
            needs of Aligarh Muslim University&apos;s research community.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-10 bg-white rounded-[2.5rem] border border-gray-100 hover:border-amu-green/30 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-amu-green/5 hover:-translate-y-2 flex flex-col items-start text-left"
            >
              <div
                className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner`}
              >
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-amu-green transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed font-medium">
                {feature.description}
              </p>

              {/* Decorative corner element */}
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-amu-green/5 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-amu-green" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
