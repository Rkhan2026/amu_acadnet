import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  secure: true,
});

export async function uploadToCloudinary(
  base64Data,
  folder = "acadnet",
  publicId = null,
) {
  if (!base64Data) return null;

  try {
    const uploadOptions = {
      folder: folder,
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
      uploadOptions.overwrite = true; // Allow overwriting if same ID is used
      uploadOptions.invalidate = true; // Invalidate CDN cache
    }

    // Set resource_type to "auto" to handle PDFs and other non-image files
    uploadOptions.resource_type = "auto";

    const uploadResponse = await cloudinary.uploader.upload(
      base64Data,
      uploadOptions,
    );
    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}
