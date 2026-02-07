"use client";
import React from "react";

const About = () => {
  return (
    <section id="about" className="py-24 bg-gray-50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            About AMU AcadNet
          </h2>
          <div className="w-24 h-1.5 bg-amu-green mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            AMU AcadNet is the official academic social network designed
            exclusively for Aligarh Muslim University. Our platform bridges the
            gap between students, faculty, and researchers, creating a unified
            ecosystem for innovation and academic excellence.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
