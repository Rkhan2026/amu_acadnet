import React, { memo } from "react";
import { User, BookOpen } from "lucide-react";

const BiographySection = memo(({ user }) => {
  const interests = (
    user.researchInterests ||
    user.academicProfile?.researchInterests ||
    ""
  )
    .split(",")
    .filter((i) => i.trim() !== "");

  return (
    <div className="lg:col-span-2 space-y-8">
      <div className="bg-white rounded-4xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-amu-green/10 rounded-xl">
            <User className="h-5 w-5 text-amu-green" />
          </div>
          Biography
        </h3>
        <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
          {user.biography ||
            user.academicProfile?.biography ||
            "No biography provided yet. This researcher is dedicated to their field of study at Aligarh Muslim University."}
        </p>
      </div>

      <div className="bg-white rounded-4xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-amu-gold/10 rounded-xl">
            <BookOpen className="h-5 w-5 text-amu-gold" />
          </div>
          Interests
        </h3>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest, idx) => (
            <span
              key={idx}
              className="px-4 py-2 bg-gray-50 text-gray-700 font-bold rounded-xl border border-gray-100 hover:border-amu-green/30 hover:bg-amu-green/5 transition-all cursor-default"
            >
              {interest.trim()}
            </span>
          ))}
          {interests.length === 0 && (
            <span className="text-gray-400 text-sm italic">
              No specific interests listed.
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

BiographySection.displayName = "BiographySection";
export default BiographySection;
