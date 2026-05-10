import {
  withAuth,
  successResponse,
  errorResponse,
  normalizeTags,
} from "@/lib/api-utils";
import {
  getProjectDetail,
  updateProject,
  deleteProject,
} from "@/lib/services/project";

export const GET = withAuth(
  async (request, session, { params }) => {
    const { projectID } = await params;
    const project = await getProjectDetail(projectID, session?.universityID);
    if (!project) return errorResponse("Project not found", 404);
    return successResponse(project);
  },
  { required: false },
);

export const DELETE = withAuth(async (request, session, { params }) => {
  try {
    const { projectID } = await params;
    await deleteProject(projectID, session);
    return successResponse({ success: true });
  } catch (error) {
    if (error.message === "Project not found")
      return errorResponse(error.message, 404);
    if (error.message === "Unauthorized")
      return errorResponse(error.message, 403);
    return errorResponse(error.message, 500);
  }
});

export const PUT = withAuth(async (request, session, { params }) => {
  try {
    const { projectID } = await params;
    const body = await request.json();
    body.requirements = normalizeTags(body.requirements);
    const updated = await updateProject(projectID, body, session);
    return successResponse(updated);
  } catch (error) {
    if (error.message === "Project not found")
      return errorResponse(error.message, 404);
    if (error.message === "Unauthorized")
      return errorResponse(error.message, 403);
    return errorResponse(error.message, 500);
  }
});
