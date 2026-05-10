import { getCollaboratorRecommendations } from "@/lib/recommendations/engine";
import { withAuth, successResponse, errorResponse } from "@/lib/api-utils";

export const GET = withAuth(async (request, session) => {
  if (!session?.universityID) return errorResponse("Unauthorized", 401);
  const recommendations = await getCollaboratorRecommendations(
    session.universityID,
  );
  return successResponse({ recommendations });
});
