"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // danger, warning, info
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-4xl shadow-2xl overflow-hidden border border-gray-100"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`p-3 rounded-2xl ${
                    variant === "danger"
                      ? "bg-red-50 text-red-500"
                      : variant === "warning"
                        ? "bg-amu-gold/10 text-amu-gold"
                        : "bg-amu-green/10 text-amu-green"
                  }`}
                >
                  <AlertCircle className="h-6 w-6" />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                {title}
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                {message}
              </p>

              <div className="mt-10 flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 bg-gray-50 text-gray-500 font-black rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest text-xs"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 py-4 font-black rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg ${
                    variant === "danger"
                      ? "bg-red-500 text-white shadow-red-200 hover:bg-red-600"
                      : variant === "warning"
                        ? "bg-amu-gold text-white shadow-amu-gold/20 hover:bg-amu-gold-dark"
                        : "bg-amu-green text-white shadow-amu-green/20 hover:bg-amu-green-dark"
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
