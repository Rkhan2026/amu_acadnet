import { uploadToCloudinary } from "@/lib/cloudinary";
import { getHashedId } from "@/lib/session";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";
import { registerUser } from "@/lib/services/auth";

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      universityID,
      name,
      email,
      password,
      role,
      department,
      identityProof,
    } = data;
    if (
      !universityID ||
      !name ||
      !email ||
      !password ||
      !role ||
      !department ||
      !identityProof
    )
      return errorResponse("Missing required fields.", 400);

    const hashedID = getHashedId(universityID);
    const identityProofUrl = await uploadToCloudinary(
      identityProof,
      "acadnet/identity_proofs",
      `${hashedID}_identity_proof`,
    );
    const profilePhotoUrl = data.profilePhoto
      ? await uploadToCloudinary(
          data.profilePhoto,
          "acadnet/profile_photos",
          `${hashedID}_profile_photo`,
        )
      : "/default-avatar.svg";

    await registerUser(data, profilePhotoUrl, identityProofUrl);
    return successResponse(
      { message: "Registration successful! Awaiting admin approval." },
      201,
    );
  } catch (error) {
    if (error.message === "User already exists")
      return errorResponse(error.message, 409);
    return handleApiError(error, "Registration");
  }
}
