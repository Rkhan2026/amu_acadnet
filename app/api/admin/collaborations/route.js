import { withAuth, successResponse } from "@/lib/api-utils";
import { getCollaborativeProjects } from "@/lib/services/admin";

export const GET = withAuth(
  async () => {
    const projects = await getCollaborativeProjects();
    return successResponse(projects);
  },
  { allowedRoles: ["ADMIN"] },
);
