import React from "react";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";

export const TokenValidating = () => (
  <div className="bg-white py-12 px-8 shadow-xl border border-gray-100 sm:rounded-2xl text-center flex flex-col items-center max-w-md mx-auto w-full">
    <Loader2 className="w-16 h-16 text-amu-green animate-spin mb-6" />
    <h3 className="text-xl font-medium text-gray-900">Verifying link...</h3>
  </div>
);

export const TokenError = ({ error }) => (
  <div className="bg-white py-12 px-8 shadow-xl border border-gray-100 sm:rounded-2xl text-center flex flex-col items-center max-w-md mx-auto w-full">
    <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
    <h3 className="text-2xl font-bold text-gray-900 mb-3">
      {error || "Invalid or Missing Reset Link"}
    </h3>
    <p className="text-gray-500 mb-8 text-sm">
      You cannot access this page because your token is missing, expired, or has
      already been used.
    </p>
    <Link
      href="/"
      className="bg-amu-green hover:bg-green-800 text-white font-medium py-2.5 px-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amu-green transition-all"
    >
      Go Back to Home Page
    </Link>
  </div>
);

export const ResetSuccess = ({ message }) => (
  <div className="text-center py-6 flex flex-col items-center">
    <CheckCircle className="w-16 h-16 text-amu-green mb-6" />
    <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
    <p className="text-sm text-gray-500">{message}</p>
  </div>
);

export const PasswordInput = ({
  label,
  value,
  onChange,
  show,
  onToggle,
  placeholder,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Lock className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type={show ? "text" : "password"}
        required
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all"
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  </div>
);
