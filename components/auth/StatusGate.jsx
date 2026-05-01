import React from "react";
import { AlertCircle, Loader2 } from "lucide-react";

const StatusGate = ({ status, onAction }) => {
  if (status === "REJECTED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md text-center border border-gray-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-100">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
            Access Denied
          </h2>
          <p className="text-gray-500 mb-8 font-medium">
            You cannot access the dashboard without your status being approved.
            Please update your profile.
          </p>
          <button
            onClick={onAction}
            className="w-full py-4 bg-amu-green text-white font-black rounded-2xl hover:bg-green-800 transition-all shadow-lg shadow-amu-green/20"
          >
            Update Profile
          </button>
        </div>
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md text-center border border-gray-100">
          <div className="w-20 h-20 bg-amu-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-amu-gold/20">
            <Loader2 className="h-10 w-10 text-amu-gold animate-spin" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
            Approval Pending
          </h2>
          <p className="text-gray-500 mb-8 font-medium">
            Your account is still awaiting administrator approval. Please check
            back later.
          </p>
          <button
            onClick={onAction}
            className="w-full py-4 bg-amu-green text-white font-black rounded-2xl hover:bg-green-800 transition-all shadow-lg shadow-amu-green/20"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default StatusGate;
