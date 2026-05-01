import React from "react";
import Image from "next/image";
import { User, Tag, Building2 } from "lucide-react";

const ModalProfileHeader = ({ user, setModalImage }) => {
  return (
    <>
      <div className="relative h-64 bg-amu-green overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20 bg-[url('/grid-pattern.svg')] bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amu-gold/15 rounded-full blur-[100px] -mr-48 -mt-48" />
      </div>

      <div className="px-12 relative pb-10">
        <div className="flex flex-col md:flex-row gap-12 -mt-24 items-start md:items-end">
          <div
            className="relative w-56 h-56 rounded-[3rem] overflow-hidden border-[12px] border-white shadow-2xl bg-gray-100 cursor-pointer group shrink-0"
            onClick={() => {
              if (user.profilePhoto) setModalImage(user.profilePhoto);
            }}
          >
            {user.profilePhoto ? (
              <Image
                src={
                  user.profilePhoto.match(/\.[a-zA-Z0-9]+$/)
                    ? user.profilePhoto
                    : `${user.profilePhoto}.jpg`
                }
                alt={user.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-200">
                <User className="w-24 h-24" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                <User className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-8 pt-20 md:pt-0">
            <div className="flex items-center gap-4 flex-wrap">
              <h2 className="text-6xl font-black text-gray-900 tracking-tighter">
                {user.name}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-8">
              <div className="px-6 py-3 bg-amu-gold text-white text-sm font-black uppercase tracking-[0.25em] rounded-2xl shadow-xl shadow-amu-gold/20 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span>{user.role}</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600 font-black tracking-[0.3em] uppercase text-sm">
                <Building2 className="h-5 w-5 text-amu-gold" />
                <span>{user.department}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalProfileHeader;
