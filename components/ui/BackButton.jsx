import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const BackButton = ({ href, onClick, label = "Go Back" }) => {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
      <Link
        href={href}
        onClick={onClick}
        className="group flex items-center gap-2 text-gray-400 hover:text-amu-green font-bold mb-10 transition-colors uppercase tracking-widest text-[10px] w-fit"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />{" "}
        {label}
      </Link>
    </motion.div>
  );
};

export default BackButton;
