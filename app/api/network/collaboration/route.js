import { withAuth, successResponse, errorResponse } from "@/lib/api-utils";
import { manageCollaboration } from "@/lib/services/network";

export const POST = withAuth(async (request, session) => {
  const data = await request.json();
  if (!data.projectID || !data.receiverID)
    return errorResponse("Missing required fields", 400);

  try {
    const collab = await manageCollaboration(
      "CREATE",
      data,
      session.universityID,
    );
    return successResponse(collab, 201);
  } catch (err) {
    return errorResponse(err.message, 409);
  }
});

export const PATCH = withAuth(async (request, session) => {
  const data = await request.json();
  if (
    !data.requestID ||
    !["ACCEPTED", "REJECTED"].includes(data.requestStatus)
  ) {
    return errorResponse("Invalid data", 400);
  }

  try {
    const updated = await manageCollaboration(
      "UPDATE",
      data,
      session.universityID,
    );
    return successResponse(updated);
  } catch (err) {
    return errorResponse(err.message, 403);
  }
});

export const DELETE = withAuth(async (request, session) => {
  const data = await request.json();
  if (!data.requestID) return errorResponse("Missing request ID", 400);

  try {
    await manageCollaboration("DELETE", data, session.universityID);
    return successResponse({ success: true, message: "Collaboration removed" });
  } catch (err) {
    return errorResponse(err.message, 403);
  }
});
