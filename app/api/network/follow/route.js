import { withAuth, successResponse, errorResponse } from "@/lib/api-utils";
import { manageFollow } from "@/lib/services/network";

export const POST = withAuth(async (request, session) => {
  const { targetID } = await request.json();
  if (!targetID) return errorResponse("Missing target user ID", 400);

  const follow = await manageFollow("FOLLOW", {
    followerID: session.universityID,
    followingID: targetID,
  });
  return successResponse(follow, 201);
});

export const PATCH = withAuth(async (request, session) => {
  const { followID, requestStatus } = await request.json();
  if (!followID || !["ACCEPTED", "REJECTED"].includes(requestStatus))
    return errorResponse("Invalid data", 400);

  try {
    const updated = await manageFollow("UPDATE", {
      followID,
      requestStatus,
      followerID: session.universityID,
    });
    return successResponse(updated);
  } catch (error) {
    return errorResponse(error.message, 403);
  }
});

export const DELETE = withAuth(async (request, session) => {
  const { targetID, direction } = await request.json();
  if (!targetID) return errorResponse("Missing target user ID", 400);

  const params =
    direction === "follower"
      ? { followerID: targetID, followingID: session.universityID }
      : { followerID: session.universityID, followingID: targetID };
  await manageFollow("UNFOLLOW", params);
  return successResponse({ success: true });
});
