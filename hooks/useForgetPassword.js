"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function useForgetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendCode = async (e) => {
    if (e) e.preventDefault();
    if (email.trim() === "") return setError("Please enter a valid email.");

    setLoading(true);
    setError("");
    setMessage("");

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

  return {
    email,
    setEmail,
    loading,
    message,
    setMessage,
    error,
    setError,
    handleSendCode,
  };
}
