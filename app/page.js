import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";

export default function Home() {
  return (
    <div className="pt-0">
      {" "}
      {/* Padding managed by content or layout if needed, but Navbar is fixed so we might need pt-16 here or in global layout main */}
      <Hero />
      <Features />
    </div>
  );
}
