"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  BookOpen,
  User,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/constants";
import Link from "next/link";

import RoleSelection from "./register/RoleSelection";
import PersonalInfo from "./register/PersonalInfo";
import AcademicDetails from "./register/AcademicDetails";
import ResearchProfile from "./register/ResearchProfile";
import { useRegister } from "@/hooks/useRegister";

export default function RegisterForm() {
  const {
    step,
    isLoading,
    formData,
    setFormData,
    errors,
    profilePhotoName,
    identityProofName,
    interests,
    interestInput,
    setInterestInput,
    handleInputChange,
    handleNext,
    handleBack,
    handleSubmit,
    handleFileChange,
    addInterest,
    removeInterest,
  } = useRegister();

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
            >
              <RoleSelection
                roles={roles}
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
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
            >
              <PersonalInfo
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
              />
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
            >
              <AcademicDetails
                formData={formData}
                handleInputChange={handleInputChange}
                handleFileChange={handleFileChange}
                errors={errors}
                identityProofName={identityProofName}
                profilePhotoName={profilePhotoName}
              />
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
            >
              <ResearchProfile
                formData={formData}
                handleInputChange={handleInputChange}
                interests={interests}
                interestInput={interestInput}
                setInterestInput={setInterestInput}
                addInterest={addInterest}
                removeInterest={removeInterest}
                errors={errors}
              />
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
    </motion.div>
  );
}
