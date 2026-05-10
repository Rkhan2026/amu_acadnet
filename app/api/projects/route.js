import {
  withAuth,
  successResponse,
  errorResponse,
  normalizeTags,
} from "@/lib/api-utils";
import { getProjectsList, createProject } from "@/lib/services/project";

export const GET = withAuth(
  async (request, session) => {
    const { searchParams } = new URL(request.url);
    const projects = await getProjectsList({
      domain: searchParams.get("domain"),
      search: searchParams.get("search"),
      mine: searchParams.get("mine"),
      status: searchParams.get("status"),
      following: searchParams.get("following"),
      userRole: session?.role,
      universityID:
        searchParams.get("universityID") ||
        (["true", "following"].includes(
          searchParams.get("mine") || searchParams.get("following"),
        )
          ? session?.universityID
          : null),
      excludeMe:
        !searchParams.get("universityID") && searchParams.get("mine") !== "true"
          ? session?.universityID
          : null,
    });

    // If user is logged in, calculate match scores for general feed
    if (
      session?.universityID &&
      !searchParams.get("universityID") &&
      searchParams.get("mine") !== "true"
    ) {
      const { getProjectRecommendations } =
        await import("@/lib/recommendations/engine");
      const recommendedProjects = await getProjectRecommendations(
        session.universityID,
        projects,
      );
      return successResponse(recommendedProjects);
    }

    return successResponse(projects);
  },
  { required: false },
);

export const POST = withAuth(async (request, session) => {
  const allowedRoles = ["FACULTY", "RESEARCH_SCHOLAR", "USER", "STUDENT"];
  if (!allowedRoles.includes(session.role))
    return errorResponse("Only verified members can create projects", 403);

  const data = await request.json();
  if (!data.title || !data.description || !data.projectDomain)
    return errorResponse("Missing required fields", 400);

  data.requirements = normalizeTags(data.requirements);
  const project = await createProject(session.universityID, data);
  return successResponse(project, 201);
});
