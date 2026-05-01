import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const BaseModal = ({
  isOpen,
  onClose,
  children,
  maxWidth = "max-w-6xl",
  className = "",
  zIndex = "z-[300]",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className={`fixed inset-0 ${zIndex} flex items-center justify-center p-4 md:p-8`}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            className={`relative w-full ${maxWidth} max-h-[92vh] bg-gray-50 rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col ${className}`}
          >
            {/* Close Button */}
            <div className="absolute top-6 right-6 z-20">
              <button
                onClick={onClose}
                className="p-3 bg-white/80 backdrop-blur-md text-gray-400 hover:text-gray-900 hover:bg-white rounded-2xl transition-all shadow-lg border border-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BaseModal;
