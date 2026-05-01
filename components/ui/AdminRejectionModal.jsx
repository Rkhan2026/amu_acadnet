import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle } from "lucide-react";

const AdminRejectionModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialFeedback,
  title = "Reject Submission",
  description = "Please provide reason for rejection to help the user update their submission.",
  placeholder = "e.g., Description is too vague, please add more details...",
}) => {
  const [feedback, setFeedback] = React.useState("");

  React.useEffect(() => {
    if (isOpen) setFeedback("");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-12 border border-gray-100"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-4 bg-red-50 rounded-2xl mb-6">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">{title}</h2>
            <p className="text-gray-600 font-bold text-sm leading-relaxed max-w-xs">
              {description}
            </p>
          </div>

          <div className="space-y-6">
            {initialFeedback && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Previous Admin Feedback
                </label>
                <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                  <p className="text-sm font-bold text-gray-500 italic leading-relaxed">
                    &quot;{initialFeedback}&quot;
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                {initialFeedback
                  ? "New Admin Feedback"
                  : "Admin Feedback (Required)"}
              </label>
              <textarea
                autoFocus
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={placeholder}
                className="w-full h-36 p-6 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-red-500 focus:bg-white focus:ring-0 transition-all text-gray-900 text-base font-bold resize-none placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-10">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-4 bg-gray-100 text-gray-600 font-black rounded-xl hover:bg-gray-200 transition-all uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(feedback)}
              disabled={isSubmitting || !feedback.trim()}
              className="px-6 py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all uppercase tracking-widest text-xs shadow-lg shadow-red-600/30 disabled:opacity-50 disabled:shadow-none"
            >
              {isSubmitting ? "Processing..." : "Submit"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminRejectionModal;
