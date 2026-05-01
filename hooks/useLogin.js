"use client";
import { useState } from "react";
import { setCurrentUser, notifyUserChange } from "@/lib/utils/auth";

export function useLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setCurrentUser(data.user);
        notifyUserChange();
        if (data.user.role === "ADMIN") {
          window.location.href = "/admin/dashboard";
        } else if (data.user.accountStatus === "REJECTED") {
          window.location.href = "/resubmit-profile";
        } else {
          window.location.href = "/home";
        }
      } else {
        setError(data.error || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    showPassword,
    setShowPassword,
    isLoading,
    error,
    handleChange,
    handleSubmit,
  };
}
