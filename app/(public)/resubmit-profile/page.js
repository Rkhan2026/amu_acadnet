"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  Loader2,
  User,
  Building2,
  BookOpen,
  Mail,
  GraduationCap,
  IdCard,
  ExternalLink,
} from "lucide-react";
import { AMU_DEPARTMENTS } from "@/lib/utils";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ResubmitProfilePage() {
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
    researchInterests: "",
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
            researchInterests:
              profileData.academicProfile?.researchInterests || "",
            profilePhoto: "", // Allow uploading new photo
            identityProof: "", // Allow uploading new proof
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

  if (loading) return <LoadingSpinner fullPage message="Loading profile..." />;

  if (!user) return null;

  const handleModalClose = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout failed", err);
    }
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Rejection Notice */}
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-2xl shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-100 rounded-xl">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-red-800">
                Registration Requires Updates
              </h2>
              <p className="text-red-600 mt-2 font-medium">
                Your profile verification was not approved. Please review the
                admin feedback below, update your details, and resubmit.
              </p>
              <div className="mt-4 p-4 bg-white rounded-xl border border-red-100 text-red-900 font-medium">
                <span className="text-xs font-bold uppercase tracking-widest text-red-400 block mb-1">
                  Admin Feedback:
                </span>
                {user.adminFeedback || "No specific feedback provided."}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-4xl shadow-xl border border-gray-100">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">
            Update Registration Details
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <GraduationCap className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, role: e.target.value }))
                    }
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all appearance-none"
                  >
                    <option value="" disabled>
                      Select your role
                    </option>
                    <option value="STUDENT">Student</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="RESEARCH SCHOLAR">Research Scholar</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  University ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <IdCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.universityID}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        universityID: e.target.value,
                      }))
                    }
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Department
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        department: e.target.value,
                      }))
                    }
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all appearance-none"
                  >
                    <option value="" disabled>
                      Select your department
                    </option>
                    {AMU_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Biography
              </label>
              <textarea
                rows={4}
                value={formData.biography}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    biography: e.target.value,
                  }))
                }
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all"
                placeholder="Briefly describe your academic background and goals..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Interests
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.researchInterests}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      researchInterests: e.target.value,
                    }))
                  }
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amu-green focus:border-amu-green outline-none transition-all"
                  placeholder="e.g. Machine Learning, NLP, Computer Vision (comma separated)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Profile Photo
                </label>
                <div className="flex gap-3 items-stretch">
                  <div className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors relative cursor-pointer min-w-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "profilePhoto")}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center text-center gap-2 pointer-events-none p-2 overflow-hidden w-full">
                      <UploadCloud className="h-6 w-6 text-gray-400 shrink-0" />
                      {fileNames.profilePhoto ? (
                        <p className="text-xs font-mono font-semibold text-amu-green bg-green-50 px-3 py-1.5 rounded-lg truncate max-w-full border border-green-100">
                          {fileNames.profilePhoto}
                        </p>
                      ) : (
                        <p className="text-xs font-bold text-gray-500">
                          Click or drag to upload (Max 5MB)
                        </p>
                      )}
                    </div>
                  </div>
                  {user?.profilePhoto &&
                    user.profilePhoto !== "/default-avatar.svg" && (
                      <a
                        href={user.profilePhoto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 w-20 flex flex-col items-center justify-center gap-1.5 p-2 border border-gray-200 rounded-2xl bg-white hover:bg-green-50 hover:border-amu-green/30 transition-all group"
                        title="View Current Profile Photo"
                      >
                        <div className="p-1.5 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                          <ExternalLink className="h-4 w-4 text-amu-green" />
                        </div>
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center leading-tight">
                          View
                          <br />
                          Current
                        </span>
                      </a>
                    )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Identity Proof
                </label>
                <div className="flex gap-3 items-stretch">
                  <div className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors relative cursor-pointer min-w-0">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange(e, "identityProof")}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center text-center gap-2 pointer-events-none p-2 overflow-hidden w-full">
                      <UploadCloud className="h-6 w-6 text-gray-400 shrink-0" />
                      {fileNames.identityProof ? (
                        <p className="text-xs font-mono font-semibold text-amu-green bg-green-50 px-3 py-1.5 rounded-lg truncate max-w-full border border-green-100">
                          {fileNames.identityProof}
                        </p>
                      ) : (
                        <p className="text-xs font-bold text-gray-500">
                          Click or drag to upload (Max 5MB)
                        </p>
                      )}
                    </div>
                  </div>
                  {user?.identityProof && (
                    <a
                      href={user.identityProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 w-20 flex flex-col items-center justify-center gap-1.5 p-2 border border-gray-200 rounded-2xl bg-white hover:bg-green-50 hover:border-amu-green/30 transition-all group"
                      title="View Current Identity Proof"
                    >
                      <div className="p-2 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                        <ExternalLink className="h-5 w-5 text-amu-green" />
                      </div>
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center leading-tight">
                        View
                        <br />
                        Current
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-medium text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-4 bg-amu-green text-white font-black rounded-2xl hover:bg-green-800 transition-all shadow-lg shadow-amu-green/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Resubmitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Resubmit Profile
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-amu-green" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              Resubmitted Successfully!
            </h3>
            <p className="text-gray-500 font-medium mb-8">
              Your profile has been updated and sent to the admin for approval.
              You will be logged out now.
            </p>
            <button
              onClick={handleModalClose}
              className="w-full py-4 bg-amu-green text-white font-bold rounded-2xl hover:bg-green-800 transition-all shadow-lg shadow-amu-green/20"
            >
              Okay, got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
