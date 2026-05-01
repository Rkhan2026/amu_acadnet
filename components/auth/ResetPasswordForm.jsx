import React from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { PasswordInput, ResetSuccess } from "./ResetPasswordUI";

const ResetPasswordForm = ({
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
  onSubmit,
}) => (
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
      <ResetSuccess message={successMessage} />
    ) : (
      <form className="space-y-6" onSubmit={onSubmit}>
        <PasswordInput
          label="New Password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            if (errorMessage) setErrorMessage("");
          }}
          show={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          placeholder="Enter new password"
        />

        <PasswordInput
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errorMessage) setErrorMessage("");
          }}
          show={showConfirmPassword}
          onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
          placeholder="Confirm new password"
        />

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
    )}
  </motion.div>
);

export default ResetPasswordForm;
