import { withAuth, successResponse, normalizeTags } from "@/lib/api-utils";
import { searchUsers } from "@/lib/services/profile";

export const GET = withAuth(
  async (request, session) => {
    const { searchParams } = new URL(request.url);
    const filters = {
      all: searchParams.get("all") === "true",
      interests: normalizeTags(searchParams.get("interests")),
    };

    const users = await searchUsers(filters, session?.universityID);
    return successResponse(users);
  },
  { required: false },
);
