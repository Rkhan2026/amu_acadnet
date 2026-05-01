import React from "react";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import ActionSuccess from "@/components/ui/ActionSuccess";
import RejectionNotice from "@/components/profile/RejectionNotice";
import ResubmitProfileForm from "@/components/profile/ResubmitProfileForm";

const ResubmitProfileLayout = ({
  user,
  formData,
  setFormData,
  fileNames,
  handleFileChange,
  submitting,
  error,
  showSuccessModal,
  onSubmit,
  onModalClose,
}) => (
  <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto space-y-8">
      <ActionSuccess
        isOpen={showSuccessModal}
        onClose={onModalClose}
        showLoading={false}
        title="Resubmitted Successfully!"
        description="Your profile has been updated and sent to the admin for approval. You will be logged out now."
        buttonText="Okay, got it"
      />

      <RejectionNotice feedback={user.adminFeedback} />

      <div className="bg-white p-8 rounded-4xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">
          Update Registration Details
        </h1>

        <form onSubmit={onSubmit} className="space-y-6">
          <ResubmitProfileForm
            formData={formData}
            setFormData={setFormData}
            fileNames={fileNames}
            handleFileChange={handleFileChange}
            user={user}
          />

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
  </div>
);

export default ResubmitProfileLayout;
