import React from "react";
import { AlertCircle } from "lucide-react";

const RejectionNotice = ({ feedback }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-2xl shadow-sm">
    <div className="flex items-start gap-4">
      <div className="p-2 bg-red-100 rounded-xl">
        <AlertCircle className="h-6 w-6 text-red-600" />
      </div>
      <div>
        <h2 className="text-xl font-black text-red-800">
          Registration Requires Updates
        </h2>
        <p className="text-red-600 mt-2 font-medium">
          Your profile verification was not approved. Please review the admin
          feedback below, update your details, and resubmit.
        </p>
        <div className="mt-4 p-4 bg-white rounded-xl border border-red-100 text-red-900 font-medium">
          <span className="text-xs font-bold uppercase tracking-widest text-red-400 block mb-1">
            Admin Feedback:
          </span>
          {feedback || "No specific feedback provided."}
        </div>
      </div>
    </div>
  </div>
);

export default RejectionNotice;
