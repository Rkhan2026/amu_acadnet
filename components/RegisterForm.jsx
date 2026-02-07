"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  GraduationCap,
  BookOpen,
  User,
  Loader2,
} from "lucide-react";
import { cn, AMU_DEPARTMENTS } from "@/lib/utils";
import Link from "next/link";

export default function RegisterForm() {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    idNumber: "", // Enrollment for Student, Faculty ID for others
  });
  const [errors, setErrors] = useState({});

  // Clear errors when step changes (ensure clean slate)
  useState(() => {
    setErrors({});
  }, [step]);

  const roles = [
    {
      id: "student",
      label: "Student",
      icon: GraduationCap,
      description: "For current AMU students",
    },
    {
      id: "faculty",
      label: "Faculty",
      icon: BookOpen,
      description: "For teaching staff & professors",
    },
    {
      id: "scholar",
      label: "Research Scholar",
      icon: User,
      description: "For PhD & research fellows",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    let isValid = true;

    if (currentStep === 0) {
      if (!formData.role) {
        newErrors.role = "Please select a role to continue.";
        isValid = false;
      }
    } else if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = "Full Name is required.";
        isValid = false;
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required.";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address.";
        isValid = false;
      }
      if (!formData.password) {
        newErrors.password = "Password is required.";
        isValid = false;
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
        isValid = false;
      }
      if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = "Passwords do not match.";
        isValid = false;
      }
    } else if (currentStep === 2) {
      if (!formData.department) {
        newErrors.department = "Please select your department.";
        isValid = false;
      }
      if (!formData.idNumber.trim()) {
        newErrors.idNumber =
          formData.role === "faculty"
            ? "Faculty ID is required."
            : "Enrollment Number is required.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Form Submitted:", formData);
      setIsLoading(false);
      alert("Registration Successful! (Mock)");
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Join AMU AcadNet
        </h2>
        <p className="text-center text-gray-500 mt-2">
          Create your academic profile
        </p>

        {/* Progress Bar */}
        <div className="mt-6 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "h-2 w-16 rounded-full transition-colors duration-300",
                step >= i ? "bg-amu-green" : "bg-gray-200",
              )}
            />
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative overflow-hidden min-h-[300px]"
      >
        <AnimatePresence initial={false} mode="wait" custom={step}>
          {step === 0 && (
            <motion.div
              key="step0"
              custom={step}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="space-y-4"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a...
              </label>
              <div className="grid gap-4">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <div
                      key={role.id}
                      onClick={() => {
                        setFormData({ ...formData, role: role.id });
                        if (errors.role) setErrors({ ...errors, role: "" });
                      }}
                      className={cn(
                        "flex items-center p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md",
                        formData.role === role.id
                          ? "border-amu-green bg-amu-green/5 ring-1 ring-amu-green"
                          : "border-gray-200 hover:border-amu-green/50",
                      )}
                    >
                      <div
                        className={cn(
                          "p-3 rounded-full mr-4",
                          formData.role === role.id
                            ? "bg-amu-green text-white"
                            : "bg-gray-100 text-gray-500",
                        )}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {role.label}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {role.description}
                        </p>
                      </div>
                      {formData.role === role.id && (
                        <Check className="ml-auto w-5 h-5 text-amu-green" />
                      )}
                    </div>
                  );
                })}
              </div>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              custom={step}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all",
                    errors.name ? "border-red-500" : "border-gray-300",
                  )}
                  placeholder="e.g. John Doe"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all",
                    errors.email ? "border-red-500" : "border-gray-300",
                  )}
                  placeholder="name@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all",
                    errors.password ? "border-red-500" : "border-gray-300",
                  )}
                  placeholder="Create a strong password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all",
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300",
                  )}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={step}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all bg-white",
                    errors.department ? "border-red-500" : "border-gray-300",
                  )}
                >
                  <option value="">Select Department</option>
                  {AMU_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.department}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.role === "faculty"
                    ? "Faculty ID"
                    : "Enrollment Number"}
                </label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all",
                    errors.idNumber ? "border-red-500" : "border-gray-300",
                  )}
                  placeholder={
                    formData.role === "faculty" ? "e.g. FAC-001" : "e.g. GK1234"
                  }
                />
                {errors.idNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          {step > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center px-6 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </button>
          ) : (
            <div></div> // Spacer
          )}

          {step < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center px-6 py-2 bg-amu-green text-white rounded-lg hover:bg-green-800 transition-colors shadow-lg hover:shadow-xl font-medium"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-8 py-2 bg-amu-green text-white rounded-lg hover:bg-green-800 transition-colors shadow-lg hover:shadow-xl font-medium disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                  Processing...
                </>
              ) : (
                "Complete Registration"
              )}
            </button>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-amu-green font-semibold hover:underline"
          >
            Log in
          </Link>
        </div>
      </form>
    </motion.div>
  );
}
