"use client";
import React, { Suspense } from "react";
import {
  CheckCircle2,
  XCircle,
  User,
  Building2,
  Clock,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import UserProfileModal from "@/components/UserProfileModal";

const VerificationCard = ({ request, onAction, onClick }) => (
  <div
    onClick={() => onClick(request)}
    className="bg-white p-8 rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in slide-in-from-right-4 duration-500 hover:border-amu-green/30 transition-all cursor-pointer group"
  >
    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
      <div className="flex gap-6 items-center">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl group-hover:bg-amu-green/5 transition-all flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
          {request.avatar && request.avatar !== "/default-avatar.svg" ? (
            <Image
              src={request.avatar}
              alt={request.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-8 w-8 text-gray-400 group-hover:text-amu-green transition-colors" />
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black text-gray-900">{request.name}</h3>
            <span className="px-3 py-1 bg-amu-gold/10 text-amu-gold text-[10px] font-black uppercase tracking-widest rounded-full border border-amu-gold/20">
              {request.role}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-500 font-medium text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {request.department}
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              ID: {request.universityId}
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="h-4 w-4" />
              {request.appliedAt}
            </div>
            {request.accountStatus !== "PENDING" && (
              <StatusBadge status={request.accountStatus} />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto">
        {/* Identity Proof Preview Section */}
        <a
          href={request.identityProof}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center gap-2 p-3 px-6 bg-amu-gold/5 border border-amu-gold/20 rounded-2xl hover:bg-amu-gold/10 transition-all cursor-pointer group/proof min-w-[140px]"
        >
          <div className="flex items-center gap-2 text-amu-gold">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Identity Proof
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 group-hover/proof:text-amu-gold transition-colors">
            <ExternalLink className="h-4 w-4" />
            <span className="text-xs font-bold">View Document</span>
          </div>
        </a>

        <div className="flex items-center gap-3">
          {request.accountStatus !== "APPROVED" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction(request.id, "approve");
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-amu-green text-white font-bold rounded-2xl hover:bg-amu-green/90 transition-all shadow-lg shadow-amu-green/20"
            >
              <CheckCircle2 className="h-5 w-5" />
              Verify
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction(request.id, "reject");
            }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <XCircle className="h-5 w-5" />
            {request.accountStatus === "REJECTED" ? "Edit Reason" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    REJECTED: "bg-red-100 text-red-700 border-red-200",
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const RejectionModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialFeedback,
}) => {
  const [feedback, setFeedback] = React.useState("");

  React.useEffect(() => {
    if (isOpen) setFeedback("");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-12 border border-gray-100"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-4 bg-red-50 rounded-2xl mb-6">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">
              Reject User
            </h2>
            <p className="text-gray-600 font-bold text-sm leading-relaxed max-w-xs">
              Please provide reason for rejection to help the user udpatee their
              profile for resubmission.
            </p>
          </div>

          <div className="space-y-6">
            {initialFeedback && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Previous Admin Feedback
                </label>
                <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                  <p className="text-sm font-bold text-gray-500 italic leading-relaxed">
                    &quot;{initialFeedback}&quot;
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                {initialFeedback
                  ? "New Admin Feedback"
                  : "Admin Feedback (Required)"}
              </label>
              <textarea
                autoFocus
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="e.g., Identity proof is still blurry, please use a scanner..."
                className="w-full h-36 p-6 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-red-500 focus:bg-white focus:ring-0 transition-all text-gray-900 text-base font-bold resize-none placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-10">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-4 bg-gray-100 text-gray-600 font-black rounded-xl hover:bg-gray-200 transition-all uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(feedback)}
              disabled={isSubmitting || !feedback.trim()}
              className="px-6 py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all uppercase tracking-widest text-xs shadow-lg shadow-red-600/30 disabled:opacity-50 disabled:shadow-none"
            >
              {isSubmitting ? "Processing..." : "Submit"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

function VerificationsContent() {
  const searchParams = useSearchParams();
  const [requests, setRequests] = React.useState([]);
  const [profileUniversityID, setProfileUniversityID] = React.useState(null);
  const [rejectionTarget, setRejectionTarget] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [mode, setMode] = React.useState(searchParams.get("mode") || "PENDING");

  React.useEffect(() => {
    const m = searchParams.get("mode");
    if (m) setMode(m);
  }, [searchParams]);

  React.useEffect(() => {
    setLoading(true);
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setRequests(
            data.map((u) => ({
              id: u.universityID,
              universityId: u.universityID,
              name: u.name,
              email: u.email,
              role: u.role,
              accountStatus: u.accountStatus,
              adminFeedback: u.adminFeedback,
              department: u.department,
              rawDate: u.createdAt || Date.now(),
              appliedAt: new Date(u.createdAt || Date.now()).toLocaleString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                },
              ),
              avatar: u.profilePhoto || "/default-avatar.svg",
              identityProof: u.identityProof,
              biography:
                u.academicProfile?.biography || "No biography provided.",
              researchInterests: u.academicProfile?.researchInterests
                ? u.academicProfile.researchInterests
                    .split(",")
                    .map((s) => s.trim())
                : ["Unspecified"],
            })),
          );
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredRequests = React.useMemo(() => {
    return requests
      .filter((r) => r.accountStatus === mode)
      .sort((a, b) => new Date(b.rawDate || 0) - new Date(a.rawDate || 0));
  }, [requests, mode]);

  const counts = React.useMemo(() => {
    return {
      PENDING: requests.filter((r) => r.accountStatus === "PENDING").length,
      APPROVED: requests.filter((r) => r.accountStatus === "APPROVED").length,
      REJECTED: requests.filter((r) => r.accountStatus === "REJECTED").length,
    };
  }, [requests]);

  const handleAction = async (id, action) => {
    try {
      if (action === "reject") {
        const req = requests.find((r) => r.id === id);
        setRejectionTarget(req);
        return;
      }

      const accountStatus = action === "approve" ? "APPROVED" : "REJECTED";
      const res = await fetch(`/api/admin/users/${id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountStatus }),
      });
      if (res.ok) {
        setRequests((prev) =>
          prev.map((req) => (req.id === id ? { ...req, accountStatus } : req)),
        );
        if (profileUniversityID === id) {
          setProfileUniversityID(null);
        }
      } else {
        console.error("Action failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectionConfirm = async (comment) => {
    if (!rejectionTarget || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${rejectionTarget.id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountStatus: "REJECTED",
          adminFeedback: feedback,
        }),
      });

      if (res.ok) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === rejectionTarget.id
              ? { ...req, accountStatus: "REJECTED", adminFeedback: comment }
              : req,
          ),
        );
        setRejectionTarget(null);
        if (profileUniversityID === rejectionTarget.id) {
          setProfileUniversityID(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
            Academic Verifications
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Manage institutional records and academic affiliations for members
            of AMU.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white p-1.5 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 w-fit">
          {[
            { label: "Pending", value: "PENDING" },
            { label: "Verified", value: "APPROVED" },
            { label: "Rejected", value: "REJECTED" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setMode(tab.value)}
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                mode === tab.value
                  ? "bg-amu-green text-white shadow-lg shadow-amu-green/20"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  mode === tab.value
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {counts[tab.value]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <LoadingSpinner message="Loading records..." />
        ) : filteredRequests.length > 0 ? (
          filteredRequests.map((req) => (
            <div key={req.id} className="relative">
              <VerificationCard
                request={req}
                onClick={(user) => setProfileUniversityID(user.universityId)}
                onAction={handleAction}
              />
            </div>
          ))
        ) : (
          <div className="bg-white p-20 rounded-4xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="p-6 bg-amu-green/10 rounded-3xl mb-6">
              <CheckCircle2 size={48} className="text-amu-green" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              {mode === "PENDING"
                ? "Queue is Clear!"
                : mode === "APPROVED"
                  ? "No Verified Users"
                  : "No Rejection History"}
            </h3>
            <p className="text-gray-500 font-medium">
              {mode === "PENDING"
                ? "All academic profiles have been successfully verified."
                : mode === "APPROVED"
                  ? "The institutional registry currently has no verified members."
                  : "There are no users currently in the rejected state."}
            </p>
          </div>
        )}
      </div>

      <UserProfileModal
        isOpen={!!profileUniversityID}
        onClose={() => setProfileUniversityID(null)}
        universityID={profileUniversityID}
        onAdminAction={handleAction}
        initialAdminFeedback={
          requests.find((r) => r.id === profileUniversityID)?.adminFeedback
        }
      />

      <RejectionModal
        isOpen={!!rejectionTarget}
        onClose={() => setRejectionTarget(null)}
        onSubmit={handleRejectionConfirm}
        isSubmitting={isSubmitting}
        initialFeedback={rejectionTarget?.adminFeedback}
      />
    </div>
  );
}

export default function VerificationsPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Accessing records..." />}>
      <VerificationsContent />
    </Suspense>
  );
}
