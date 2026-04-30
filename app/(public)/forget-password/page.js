"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendCode = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (email.trim() === "") {
      setError("Please enter a valid email.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(
          data.message || "Password reset link sent! Check your email.",
        );
        setEmail("");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Forget Password
            </h2>
            <p className="text-gray-500 mt-2">
              Enter your registered email to receive a password reset link.
            </p>
          </div>

          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error || message) {
                      setError("");
                      setMessage("");
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {message && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg text-center font-medium">
                {message}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium">
                {error}
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
                  Sending...
                </>
              ) : (
                "Send Password Reset Link"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm font-medium">
            <Link
              href="/login"
              className="inline-flex items-center text-amu-green hover:text-green-800 hover:underline transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
