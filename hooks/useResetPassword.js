import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useResetPassword(token) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isValidating, setIsValidating] = useState(true);
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    if (!token) {
      setIsValidating(false);
      return;
    }
    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/reset-password?token=${token}`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (newPassword !== confirmPassword)
      return setErrorMessage("Passwords do not match.");
    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password.");
      setSuccessMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    errorMessage,
    setErrorMessage,
    successMessage,
    isValidating,
    tokenError,
    handleSubmit,
  };
}
