import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

const ActionSuccess = ({
  isOpen,
  onClose,
  title = "Success!",
  description,
  redirectingText = "Redirecting...",
  showLoading = true,
  buttonText = "Okay",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-12 rounded-4xl shadow-2xl shadow-gray-200/50 border border-gray-100 text-center max-w-md w-full"
      >
        <div className="w-20 h-20 bg-amu-green/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-amu-green" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-500 font-medium leading-relaxed">
          {description}
        </p>
        {showLoading ? (
          <div className="mt-8 flex items-center justify-center gap-2 text-amu-green font-bold uppercase tracking-widest text-[10px]">
            <Loader2 className="h-3 w-3 animate-spin" />
            {redirectingText}
          </div>
        ) : (
          <button
            onClick={onClose}
            className="mt-8 w-full py-4 bg-amu-green text-white font-bold rounded-2xl hover:bg-green-800 transition-all shadow-lg shadow-amu-green/20"
          >
            {buttonText}
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default ActionSuccess;
