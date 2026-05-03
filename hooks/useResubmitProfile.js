import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearCurrentUser, notifyUserChange } from "@/lib/utils/auth";

export function useResubmitProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    universityID: "",
    department: "",
    biography: "",
    interestsSkills: "",
    profilePhoto: "",
    identityProof: "",
  });
  const [fileNames, setFileNames] = useState({
    profilePhoto: "",
    identityProof: "",
  });
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push("/login");
          return;
        }
        if (data.user.accountStatus !== "REJECTED") {
          router.push("/home");
          return;
        }
        return fetch(`/api/profile/${data.user.universityID}`).then((res) =>
          res.json(),
        );
      })
      .then((profileData) => {
        if (profileData && !profileData.error) {
          setUser(profileData);
          setFormData({
            name: profileData.name || "",
            email: profileData.email || "",
            role: profileData.role || "",
            universityID: profileData.universityID || "",
            department: profileData.department || "",
            biography: profileData.academicProfile?.biography || "",
            interestsSkills:
              profileData.academicProfile?.interestsSkills?.join(", ") || "",
            profilePhoto: "",
            identityProof: "",
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [router]);

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setFileNames((prev) => ({ ...prev, [field]: file.name }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/profile/${user.universityID}/resubmit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowSuccessModal(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to resubmit profile");
      }
    } catch (_err) {
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      clearCurrentUser();
      notifyUserChange();
    } catch (err) {
      console.error("Logout failed", err);
    }
    router.push("/login");
  };

  return {
    loading,
    submitting,
    user,
    formData,
    setFormData,
    fileNames,
    handleFileChange,
    error,
    showSuccessModal,
    handleSubmit,
    handleModalClose,
  };
}
