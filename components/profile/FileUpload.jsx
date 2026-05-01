import React, { useState } from "react";
import Image from "next/image";
import { UploadCloud, ExternalLink } from "lucide-react";

const FileUpload = ({
  label,
  fileName,
  currentFileUrl,
  onFileChange,
  accept = "image/*",
}) => {
  const [preview, setPreview] = useState(
    currentFileUrl && currentFileUrl !== "/default-avatar.svg"
      ? currentFileUrl
      : null,
  );
  const [prevUrl, setPrevUrl] = useState(currentFileUrl);

  if (currentFileUrl !== prevUrl) {
    setPrevUrl(currentFileUrl);
    setPreview(
      currentFileUrl && currentFileUrl !== "/default-avatar.svg"
        ? currentFileUrl
        : null,
    );
  }

  const handleLocalChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    onFileChange(e);
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="flex gap-3 items-stretch h-32">
        <div className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors relative cursor-pointer group flex items-center justify-center overflow-hidden">
          <input
            type="file"
            accept={accept}
            onChange={handleLocalChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          {preview ? (
            <div className="relative w-full h-full p-2 flex items-center justify-center bg-white">
              <Image
                src={
                  preview.match(/\.[a-zA-Z0-9]+$/) ||
                  preview.startsWith("data:")
                    ? preview
                    : `${preview}.jpg`
                }
                alt="Preview"
                fill
                className="object-contain p-1"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 z-20">
                <UploadCloud className="h-5 w-5 text-white" />
                <span className="text-[8px] text-white font-black uppercase tracking-widest">
                  Change File
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center gap-1 pointer-events-none p-4">
              <UploadCloud className="h-6 w-6 text-gray-400 shrink-0" />
              {fileName ? (
                <p className="text-[10px] font-mono font-semibold text-amu-green truncate max-w-[150px]">
                  {fileName}
                </p>
              ) : (
                <p className="text-[10px] font-bold text-gray-500 leading-tight">
                  Click or drag to upload
                  <br />
                  (Max 5MB)
                </p>
              )}
            </div>
          )}
        </div>

        {currentFileUrl && currentFileUrl !== "/default-avatar.svg" && (
          <a
            href={currentFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-16 flex flex-col items-center justify-center gap-1 p-2 border border-gray-200 rounded-2xl bg-white hover:bg-green-50 hover:border-amu-green/30 transition-all group"
            title={`View Current ${label}`}
          >
            <div className="p-1.5 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
              <ExternalLink className="h-4 w-4 text-amu-green" />
            </div>
            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest text-center leading-tight">
              View
              <br />
              Full
            </span>
          </a>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
