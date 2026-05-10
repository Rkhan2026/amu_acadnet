import { prisma } from "@/lib/prisma";
import { getHashedId } from "@/lib/session";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  withAuth,
  successResponse,
  errorResponse,
  normalizeTags,
} from "@/lib/api-utils";
import { resubmitProfile } from "@/lib/services/profile";

export const POST = withAuth(async (request, session, { params }) => {
  const { universityID } = await params;
  if (!session || session.universityID !== universityID)
    return errorResponse("Unauthorized", 401);

  const user = await prisma.user.findUnique({ where: { universityID } });
  if (!user || user.accountStatus !== "REJECTED")
    return errorResponse("Not eligible for resubmission", 400);

  const body = await request.json();
  const hashedID = getHashedId(universityID);

  if (body.profilePhoto?.startsWith("data:")) {
    body.profilePhoto = await uploadToCloudinary(
      body.profilePhoto,
      "acadnet/profile_photos",
      `${hashedID}_profile_photo`,
    );
  }
  if (body.identityProof?.startsWith("data:")) {
    body.identityProof = await uploadToCloudinary(
      body.identityProof,
      "acadnet/identity_proofs",
      `${hashedID}_identity_proof`,
    );
  }

  body.interestsSkills = normalizeTags(body.interestsSkills);
  await resubmitProfile(universityID, body);

  return successResponse({ message: "Resubmitted successfully" });
});
