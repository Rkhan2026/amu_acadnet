import Feed from "@/components/Feed";
import { SUGGESTED_USERS } from "@/lib/dummyData";
import { UserPlus, Sparkles } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Feed */}
      <div className="lg:col-span-2">
        <Feed />
      </div>

      {/* Right Sidebar (Suggestions) */}
      <div className="hidden lg:block py-8 pr-8 space-y-8">
        {/* AI Collaboration Recommendations */}
        <div className="bg-white rounded-4xl p-8 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles className="h-12 w-12 text-amu-gold" />
          </div>

          <h3 className="font-black text-gray-900 mb-6 flex items-center gap-3 text-lg tracking-tight">
            <div className="p-2 bg-amu-gold/10 rounded-xl">
              <Sparkles className="h-5 w-5 text-amu-gold" />
            </div>
            AI Collaboration
          </h3>

          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Recommended for you
          </p>

          <div className="space-y-6">
            {SUGGESTED_USERS.map((user, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between group/user"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-gray-50 group-hover/user:border-amu-green transition-all shadow-sm">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-gray-900 leading-tight">
                      {user.name}
                    </h4>
                    <p className="text-xs font-bold text-amu-green">
                      {user.role}
                    </p>
                  </div>
                </div>
                <button className="bg-gray-50 hover:bg-amu-green hover:text-white p-2.5 rounded-2xl transition-all shadow-inner text-gray-400">
                  <UserPlus className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 bg-gray-50 hover:bg-amu-green/5 text-sm text-amu-green font-black rounded-2xl transition-all uppercase tracking-widest border border-transparent hover:border-amu-green/20">
            View All Researchers
          </button>
        </div>
      </div>
    </div>
  );
}
