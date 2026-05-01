import { useState } from "react";
import { useRouter } from "next/navigation";

export function useCreateProject() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    projectDomain: "",
    projectStatus: "Proposed",
    description: "",
    externalLinks: [""],
    requirements: [],
  });
  const [showCustomDomain, setShowCustomDomain] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        projectDomain: formData.projectDomain,
        projectStatus: formData.projectStatus,
        externalLinks: formData.externalLinks.filter((l) => l.trim() !== ""),
        requirements: formData.requirements,
      };
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsSubmitted(true);
        setTimeout(() => router.push("/projects"), 2500);
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to create project");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return {
    isSubmitting,
    isSubmitted,
    formData,
    setFormData,
    showCustomDomain,
    setShowCustomDomain,
    handleSubmit,
    handleChange,
    router,
  };
}
