import Hero from "../components/Hero";
import Features from "../components/Features";

export default function Home() {
  return (
    <div className="pt-0">
      {" "}
      {/* Padding managed by content or layout, Navbar is fixed */}
      <Hero />
      <Features />
    </div>
  );
}
