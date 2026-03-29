"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [mounted, setMounted] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    setMounted(true);
    if (!token) {
      setIsValidating(false);
      return;
    }

    // Verify token validity on load
    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/reset_password?token=${token}`);
        if (!res.ok) {
          const data = await res.json();
          setTokenError(data.error || "Invalid or expired token");
        }
      } catch (_err) {
        setTokenError("Failed to verify token");
      } finally {
        setIsValidating(false);
      }
    };

    verifyToken();
  }, [token]);

  // Hydration safety
  if (!mounted) return null;

  if (isValidating) {
    return (
      <div className="bg-white py-12 px-8 shadow-xl border border-gray-100 sm:rounded-2xl text-center flex flex-col items-center max-w-md mx-auto w-full">
        <Loader2 className="w-16 h-16 text-amu-green animate-spin mb-6" />
        <h3 className="text-xl font-medium text-gray-900">Verifying link...</h3>
      </div>
    );
  }

  // Render "Invalid Link" if no token in URL or validation failed
  if ((!token || tokenError) && !successMessage) {
    return (
      <div className="bg-white py-12 px-8 shadow-xl border border-gray-100 sm:rounded-2xl text-center flex flex-col items-center max-w-md mx-auto w-full">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {tokenError || "Invalid or Missing Reset Link"}
        </h3>
        <p className="text-gray-500 mb-8 text-sm">
          You cannot access this page because your token is missing, expired, or
          has already been used.
        </p>
        <Link
          href="/"
          className="bg-amu-green hover:bg-green-800 text-white font-medium py-2.5 px-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amu-green transition-all"
        >
          Go Back to Home Page
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/reset_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setSuccessMessage("Password reset successfully! Redirecting to login...");

      // Clear URL state and redirect
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", window.location.pathname);
      }
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
        <p className="text-gray-500 mt-2">Create a new, strong password.</p>
      </div>

      {successMessage ? (
        <div className="text-center py-6 flex flex-col items-center">
          <CheckCircle className="w-16 h-16 text-amu-green mb-6" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
          <p className="text-sm text-gray-500">{successMessage}</p>
        </div>
      ) : (
        <>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium flex items-center justify-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amu-green hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amu-green disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </>
      )}
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50/50">
      <Suspense
        fallback={
          <div className="text-center text-gray-500">
            <Loader2 className="animate-spin h-8 w-8 mx-auto" />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
