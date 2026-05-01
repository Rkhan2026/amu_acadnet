import React from "react";
import { UploadCloud, ExternalLink } from "lucide-react";

const FileUpload = ({
  label,
  fileName,
  currentFileUrl,
  onFileChange,
  accept = "image/*",
}) => {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="flex gap-3 items-stretch">
        <div className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors relative cursor-pointer min-w-0">
          <input
            type="file"
            accept={accept}
            onChange={onFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center text-center gap-2 pointer-events-none p-2 overflow-hidden w-full">
            <UploadCloud className="h-6 w-6 text-gray-400 shrink-0" />
            {fileName ? (
              <p className="text-xs font-mono font-semibold text-amu-green bg-green-50 px-3 py-1.5 rounded-lg truncate max-w-full border border-green-100">
                {fileName}
              </p>
            ) : (
              <p className="text-xs font-bold text-gray-500">
                Click or drag to upload (Max 5MB)
              </p>
            )}
          </div>
        </div>
        {currentFileUrl && currentFileUrl !== "/default-avatar.svg" && (
          <a
            href={currentFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-20 flex flex-col items-center justify-center gap-1.5 p-2 border border-gray-200 rounded-2xl bg-white hover:bg-green-50 hover:border-amu-green/30 transition-all group"
            title={`View Current ${label}`}
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
  );
};

export default FileUpload;
