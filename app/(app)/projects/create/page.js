"use client";
import React, { useState } from "react";
import {
  PlusCircle,
  Rocket,
  Info,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Tags,
  Plus,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const CreateProjectPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    researchDomain: "",
    projectStatus: "Proposed",
    description: "",
    keywords: "",
    externalLinks: [""],
  });

  const domains = [
    "Artificial Intelligence",
    "Social Sciences",
    "Physics",
    "Sustainable Development",
    "Medieval History",
    "Computer Science",
    "Law",
    "Biotechnology",
  ];

  const statuses = ["Proposed", "Active", "Completed", "Archived"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Redirect after success animation
    setTimeout(() => {
      router.push("/home");
    }, 2500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (index, value) => {
    const newLinks = [...formData.externalLinks];
    newLinks[index] = value;
    setFormData((prev) => ({ ...prev, externalLinks: newLinks }));
  };

  const addLink = () => {
    setFormData((prev) => ({
      ...prev,
      externalLinks: [...prev.externalLinks, ""],
    }));
  };

  const removeLink = (index) => {
    if (formData.externalLinks.length === 1) {
      handleLinkChange(0, "");
      return;
    }
    const newLinks = formData.externalLinks.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, externalLinks: newLinks }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-4xl shadow-2xl shadow-gray-200/50 border border-gray-100 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-amu-green/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-amu-green" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            Project Created!
          </h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            Your research project has been submitted for moderation. You&apos;ll
            be notified once it&apos;s live on the network.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-amu-green font-bold uppercase tracking-widest text-[10px]">
            <Loader2 className="h-3 w-3 animate-spin" />
            Redirecting to Home...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amu-green/10 rounded-xl">
            <PlusCircle className="h-6 w-6 text-amu-green" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Create New Project
          </h1>
        </div>
        <p className="text-gray-500 font-medium text-lg">
          Initialize your research project with institutional metadata defined
          in the project schema.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Info */}
        <div className="bg-white p-8 rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Rocket className="h-4 w-4 text-blue-500" />
            </div>
            <h2 className="text-lg font-black text-gray-900">
              Project Identity
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Exploring Neural Grafting in Localized Cognitive Centers"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amu-green/20 focus:border-amu-green transition-all font-bold text-gray-900 placeholder:text-gray-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Research Domain
                </label>
                <select
                  name="researchDomain"
                  required
                  value={formData.researchDomain}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amu-green/20 focus:border-amu-green transition-all font-bold text-gray-900 appearance-none bg-[url('/chevron-down.svg')] bg-size-[24px] bg-position-[right_1rem_center] bg-no-repeat"
                >
                  <option value="">Select Research Domain</option>
                  {domains.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Current Status
                </label>
                <select
                  name="projectStatus"
                  required
                  value={formData.projectStatus}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amu-green/20 focus:border-amu-green transition-all font-bold text-gray-900 appearance-none"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Details */}
        <div className="bg-white p-8 rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <Info className="h-4 w-4 text-purple-500" />
            </div>
            <h2 className="text-lg font-black text-gray-900">
              Project Specifics
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Description
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe the research goals and methodology..."
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amu-green/20 focus:border-amu-green transition-all font-medium text-gray-600 placeholder:text-gray-300 resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Keywords
              </label>
              <div className="relative">
                <Tags className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  placeholder="e.g. AI, Quantum, Sustainability"
                  className="w-full pl-14 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amu-green/20 focus:border-amu-green transition-all font-bold text-gray-900 placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="mb-2 ml-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  External Links
                </label>
              </div>

              {formData.externalLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      required
                      value={link}
                      onChange={(e) => handleLinkChange(index, e.target.value)}
                      placeholder="Publication URL, Repo, or Citation link"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amu-green/20 focus:border-amu-green transition-all font-bold text-gray-900 placeholder:text-gray-300"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={addLink}
                      className="p-4 bg-amu-green/10 text-amu-green rounded-2xl hover:bg-amu-green/20 transition-all"
                      title="Add Link"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                    {index > 0 ? (
                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="p-4 bg-red-50 text-red-400 rounded-2xl hover:bg-red-100 hover:text-red-500 transition-all"
                        title="Remove Link"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    ) : (
                      <div className="w-13" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-amu-green text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-amu-green/20 flex items-center justify-center gap-3 hover:bg-amu-green/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Initializing Project...
              </>
            ) : (
              <>
                Register Research Project
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="px-10 bg-gray-100 text-gray-400 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-200 hover:text-gray-600 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectPage;
