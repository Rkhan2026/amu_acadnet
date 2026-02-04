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
      "Leverage intelligent algorithms to find the perfect collaborators based on shared research interests and publication history.",
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
      "Follow peers and mentors within the university. engage in meaningful academic discourse without the noise of public platforms.",
    color: "bg-cyan-100 text-cyan-600",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base text-amu-green font-semibold tracking-wide uppercase">
            Key Modules
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Everything you need for <br />
            academic excellence.
          </p>
          <p className="mt-4 text-xl text-gray-500">
            Designed specifically to breakdown silos and enable seamless
            collaboration across Aligarh Muslim University.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div
                className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}
              >
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amu-green transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
