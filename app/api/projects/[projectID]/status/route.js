import { withAuth, successResponse, errorResponse } from "@/lib/api-utils";
import { moderateProject } from "@/lib/services/admin";

export const PATCH = withAuth(
  async (request, session, { params }) => {
    const { projectID } = await params;
    const data = await request.json();

    if (
      !data.moderationStatus ||
      !["APPROVED", "REJECTED", "PENDING"].includes(data.moderationStatus)
    ) {
      return errorResponse("Invalid moderation status", 400);
    }

    const updatedProject = await moderateProject(projectID, data);
    return successResponse(updatedProject);
  },
  { allowedRoles: ["ADMIN"] },
);
