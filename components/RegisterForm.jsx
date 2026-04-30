"use client";

import { useState, useEffect } from "react";
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
    universityID: "", // Enrollment for Student, Faculty ID for others
    biography: "",
    domain: "",
    identityProof: "",
    profilePhoto: "",
  });
  const [errors, setErrors] = useState({});

  // Clear errors when step changes (ensure clean slate)
  useEffect(() => {
    setErrors({});
  }, [step]);

  const [profilePhotoName, setProfilePhotoName] = useState("");
  const [identityProofName, setIdentityProofName] = useState("");

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
      id: "research scholar",
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
      if (!formData.universityID.trim()) {
        newErrors.universityID =
          formData.role === "faculty"
            ? "Faculty ID is required."
            : "Enrollment Number is required.";
        isValid = false;
      }
      if (!formData.identityProof) {
        newErrors.identityProof = "Identity proof is required.";
        isValid = false;
      }
    } else if (currentStep === 3) {
      if (!formData.biography.trim()) {
        newErrors.biography = "Biography is required.";
        isValid = false;
      } else if (formData.biography.trim().length < 20) {
        newErrors.biography = "Biography should be at least 20 characters.";
        isValid = false;
      }
      if (!formData.domain.trim()) {
        newErrors.domain = "Domain is required.";
        isValid = false;
      } else if (formData.domain.includes(",")) {
        newErrors.domain = "Please enter only one primary domain.";
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

  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      setIsLoading(true);
      setErrors({});
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            universityID: formData.universityID,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role.toUpperCase(),
            department: formData.department,
            biography: formData.biography,
            domain: formData.domain,
            identityProof: formData.identityProof,
            profilePhoto: formData.profilePhoto,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccessMessage(data.message || "Registration Successful!");
          setTimeout(() => {
            // Optional: window.location.href = "/login";
          }, 3000);
        } else {
          setErrors({ submit: data.error || "Registration failed" });
        }
      } catch (_err) {
        setErrors({
          submit: "An unexpected error occurred. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
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
      </div>

      {successMessage ? (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border-4 border-green-100">
            <Check className="h-10 w-10 text-amu-green" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-500 font-medium max-w-sm mb-8">
            {successMessage}
          </p>
          <Link
            href="/login"
            className="w-full py-4 bg-amu-green text-white font-black rounded-2xl hover:bg-amu-green/90 transition-all shadow-xl shadow-amu-green/20 uppercase tracking-widest text-sm flex items-center justify-center gap-2"
          >
            Proceed to Login
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <>
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center font-medium animate-in shake">
              {errors.submit}
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-8 flex justify-center gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-2 w-16 rounded-full transition-colors duration-300",
                  step >= i ? "bg-amu-green" : "bg-gray-200",
                )}
              />
            ))}
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
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="space-y-4"
                >
                  <p className="text-sm font-medium text-gray-700 mb-4">
                    Select your role in the university:
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, role: role.id }))
                        }
                        className={cn(
                          "flex items-center p-4 border-2 rounded-xl transition-all text-left group",
                          formData.role === role.id
                            ? "border-amu-green bg-green-50"
                            : "border-gray-100 hover:border-amu-green/50 hover:bg-gray-50",
                        )}
                      >
                        <div
                          className={cn(
                            "p-2 rounded-lg mr-4 transition-colors",
                            formData.role === role.id
                              ? "bg-amu-green text-white"
                              : "bg-gray-100 text-gray-500 group-hover:bg-amu-green/10 group-hover:text-amu-green",
                          )}
                        >
                          <role.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {role.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {role.description}
                          </p>
                        </div>
                        {formData.role === role.id && (
                          <Check className="h-5 w-5 text-amu-green ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-2">{errors.role}</p>
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
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
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
                      placeholder="e.g. Dr. Sarah Ahmed"
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
                      placeholder="name@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                          errors.password
                            ? "border-red-500"
                            : "border-gray-300",
                        )}
                        placeholder="••••••••"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm
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
                        placeholder="••••••••"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
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
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
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
                        "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all",
                        errors.department
                          ? "border-red-500"
                          : "border-gray-300",
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
                        : "University ID (Enrollment Number)"}
                    </label>
                    <input
                      type="text"
                      name="universityID"
                      value={formData.universityID}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all",
                        errors.universityID
                          ? "border-red-500"
                          : "border-gray-300",
                      )}
                      placeholder={
                        formData.role === "faculty" ? "F12345" : "GH8981"
                      }
                    />
                    {errors.universityID && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.universityID}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Identity Proof (JPG/PDF){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name="identityProof"
                        accept=".jpg,.jpeg,.pdf"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              setErrors((prev) => ({
                                ...prev,
                                identityProof:
                                  "File size must be less than 5MB.",
                              }));
                              return;
                            }
                            setIdentityProofName(file.name);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData((prev) => ({
                                ...prev,
                                identityProof: reader.result,
                              }));
                            };
                            reader.readAsDataURL(file);
                            setErrors((prev) => ({
                              ...prev,
                              identityProof: "",
                            }));
                          }
                        }}
                        className={cn(
                          "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all text-gray-900",
                          errors.identityProof
                            ? "border-red-500"
                            : "border-gray-300",
                        )}
                      />
                      {identityProofName && (
                        <p className="mt-1 text-xs font-bold text-amu-green">
                          Selected: {identityProofName}
                        </p>
                      )}
                    </div>
                    <p className="mt-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      Max 5MB allowed
                    </p>
                    {errors.identityProof && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.identityProof}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Photo (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name="profilePhoto"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              setErrors((prev) => ({
                                ...prev,
                                profilePhoto:
                                  "File size must be less than 5MB.",
                              }));
                              return;
                            }
                            setProfilePhotoName(file.name);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData((prev) => ({
                                ...prev,
                                profilePhoto: reader.result,
                              }));
                            };
                            reader.readAsDataURL(file);
                            setErrors((prev) => ({
                              ...prev,
                              profilePhoto: "",
                            }));
                          }
                        }}
                        className={cn(
                          "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all text-gray-900",
                          errors.profilePhoto
                            ? "border-red-500"
                            : "border-gray-300",
                        )}
                      />
                      {profilePhotoName && (
                        <p className="mt-1 text-xs font-bold text-amu-green">
                          Selected: {profilePhotoName}
                        </p>
                      )}
                    </div>
                    <p className="mt-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      Max 5MB allowed
                    </p>
                    {errors.profilePhoto && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.profilePhoto}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={step}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interests
                    </label>
                    <input
                      type="text"
                      name="domain"
                      value={formData.domain}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all",
                        errors.domain ? "border-red-500" : "border-gray-300",
                      )}
                      placeholder="e.g. Artificial Intelligence"
                    />
                    {errors.domain && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.domain}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Biography
                    </label>
                    <textarea
                      name="biography"
                      value={formData.biography}
                      onChange={handleInputChange}
                      rows={5}
                      className={cn(
                        "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all",
                        errors.biography ? "border-red-500" : "border-gray-300",
                      )}
                      placeholder="Tell us about your academic background..."
                    />
                    {errors.biography && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.biography}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between gap-4">
              {step > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 bg-amu-green text-white font-bold rounded-xl hover:bg-amu-green/90 transition-all shadow-lg shadow-amu-green/10"
                >
                  Next
                  <ChevronRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 bg-amu-green text-white font-bold rounded-xl hover:bg-amu-green/90 transition-all shadow-lg shadow-amu-green/10 disabled:opacity-70"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
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
        </>
      )}
    </motion.div>
  );
}
