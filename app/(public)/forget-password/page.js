"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ForgetPasswordForm from "@/components/auth/ForgetPasswordForm";

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (email.trim() === "") return setError("Please enter a valid email.");
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
        setTimeout(() => router.push("/login"), 3000);
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
        <ForgetPasswordForm
          email={email}
          setEmail={setEmail}
          loading={loading}
          message={message}
          setMessage={setMessage}
          error={error}
          setError={setError}
          onSubmit={handleSendCode}
        />
      </div>
    </div>
  );
}
