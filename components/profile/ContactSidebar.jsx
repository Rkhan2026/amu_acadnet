import React, { memo } from "react";
import Image from "next/image";
import { Mail, Clock, ShieldCheck, ExternalLink } from "lucide-react";

const ContactSidebar = memo(({ user, setModalImage }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Not updated recently";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-4xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
        <h3 className="text-xl font-black text-gray-900 mb-6">
          Contact & Status
        </h3>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Mail className="h-6 w-6 text-blue-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Email Address
              </p>
              <p className="font-bold text-gray-900 break-all">
                {user.email ||
                  (user.handle
                    ? `${user.handle.replace("@", "")}@gmail.com`
                    : "N/A")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amu-green/5 rounded-2xl">
              <Clock className="h-6 w-6 text-amu-green" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Last Updated
              </p>
              <p className="font-bold text-gray-900 text-sm">
                {formatDate(user.academicProfile?.lastUpdated)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-4xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <ShieldCheck className="h-5 w-5 text-blue-500" />
          </div>
          Identity Proof
        </h3>
        {user.identityProof ? (
          <>
            <div
              className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 cursor-pointer hover:border-amu-green/50 transition-all group bg-white flex items-center justify-center"
              onClick={() => setModalImage(user.identityProof)}
            >
              <Image
                src={
                  user.identityProof.match(/\.[a-zA-Z0-9]+$/)
                    ? user.identityProof
                    : `${user.identityProof}.jpg`
                }
                alt="Identity Proof"
                fill
                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <ExternalLink className="h-6 w-6 text-white" />
                <p className="text-white font-black text-[10px] uppercase tracking-widest">
                  View Identity Proof
                </p>
              </div>
            </div>
            <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
              This section is only visible to you
            </p>
          </>
        ) : (
          <div className="py-8 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
            <ShieldCheck className="h-8 w-8 text-gray-300 mb-3" />
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
              No identity proof uploaded
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

ContactSidebar.displayName = "ContactSidebar";
export default ContactSidebar;
