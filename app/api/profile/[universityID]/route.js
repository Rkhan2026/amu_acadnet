import { getHashedId } from "@/lib/session";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  withAuth,
  successResponse,
  errorResponse,
  normalizeTags,
} from "@/lib/api-utils";
import {
  getFullProfile,
  filterProfileData,
  updateProfile,
} from "@/lib/services/profile";

export const GET = withAuth(
  async (request, session, { params }) => {
    const { universityID } = await params;
    const user = await getFullProfile(universityID);

    if (!user) return errorResponse("User not found", 404);

    const { password: _password, ...userData } = user;
    return successResponse(await filterProfileData(userData, session));
  },
  { required: false },
);

export const PUT = withAuth(async (request, session, { params }) => {
  const { universityID } = await params;
  if (!session || session.universityID !== universityID)
    return errorResponse("Unauthorized", 401);

  const body = await request.json();
  const interestsSkills = normalizeTags(body.interestsSkills);

  let profilePhotoUrl = undefined;
  if (body.profilePhoto?.startsWith("data:")) {
    profilePhotoUrl = await uploadToCloudinary(
      body.profilePhoto,
      "acadnet/profile_photos",
      `${getHashedId(universityID)}_profile_photo`,
    );
  }

  const updatedUser = await updateProfile(universityID, {
    ...body,
    interestsSkills,
    profilePhotoUrl,
  });
  return successResponse(updatedUser);
});
