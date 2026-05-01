"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { TokenValidating, TokenError } from "@/components/auth/ResetPasswordUI";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

import { useResetPassword } from "@/hooks/useResetPassword";

function ResetPasswordContainer() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const {
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
  } = useResetPassword(token);

  if (isValidating) return <TokenValidating />;
  if ((!token || tokenError) && !successMessage)
    return <TokenError error={tokenError} />;

  return (
    <ResetPasswordForm
      newPassword={newPassword}
      setNewPassword={setNewPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      showConfirmPassword={showConfirmPassword}
      setShowConfirmPassword={setShowConfirmPassword}
      loading={loading}
      errorMessage={errorMessage}
      setErrorMessage={setErrorMessage}
      successMessage={successMessage}
      onSubmit={handleSubmit}
    />
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
        <ResetPasswordContainer />
      </Suspense>
    </div>
  );
}
