"use client";
import React from "react";
import ForgetPasswordForm from "@/components/auth/ForgetPasswordForm";

import { useForgetPassword } from "@/hooks/useForgetPassword";

export default function ForgetPasswordPage() {
  const {
    email,
    setEmail,
    loading,
    message,
    setMessage,
    error,
    setError,
    handleSendCode,
  } = useForgetPassword();

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
