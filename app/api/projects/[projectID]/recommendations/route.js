import { getUsersForProjectRecommendations } from "@/lib/recommendations/engine";
import { withAuth, successResponse, errorResponse } from "@/lib/api-utils";

export const GET = withAuth(async (request, session, { params }) => {
  const { projectID } = await params;

  if (!projectID) {
    return errorResponse("Missing project ID", 400);
  }

  const recommendations = await getUsersForProjectRecommendations(projectID);

  return successResponse({ recommendations });
});
