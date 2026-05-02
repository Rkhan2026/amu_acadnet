"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export function useRegister() {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    universityID: "",
    biography: "",
    domain: "",
    identityProof: "",
    profilePhoto: "",
  });
  const [errors, setErrors] = useState({});
  const [profilePhotoName, setProfilePhotoName] = useState("");
  const [identityProofName, setIdentityProofName] = useState("");
  const [interests, setInterests] = useState([]);
  const [interestInput, setInterestInput] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setErrors({});
  }, [step]);

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
      if (interests.length === 0) {
        newErrors.domain = "At least one research interest is required.";
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
    if (e) e.preventDefault();
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
            domain: interests.join(", "),
            identityProof: formData.identityProof,
            profilePhoto: formData.profilePhoto,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccessMessage(data.message || "Registration Successful!");
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

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [type]: "File size must be less than 5MB.",
        }));
        return;
      }
      if (type === "identityProof") setIdentityProofName(file.name);
      else setProfilePhotoName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [type]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({
        ...prev,
        [type]: "",
      }));
    }
  };

  const addInterest = () => {
    const val = interestInput.trim().replace(/,/g, "");
    if (val) {
      if (interests.some((i) => i.toLowerCase() === val.toLowerCase())) {
        toast.error(`${val} is already added`);
        setInterestInput("");
        return;
      }
      setInterests((prev) => [...prev, val]);
      setInterestInput("");
      setErrors((prev) => ({ ...prev, domain: "" }));
    }
  };

  const removeInterest = (index) => {
    setInterests((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    step,
    setStep,
    isLoading,
    formData,
    setFormData,
    errors,
    setErrors,
    profilePhotoName,
    identityProofName,
    interests,
    setInterests,
    interestInput,
    setInterestInput,
    successMessage,
    handleInputChange,
    handleNext,
    handleBack,
    handleSubmit,
    handleFileChange,
    addInterest,
    removeInterest,
  };
}
