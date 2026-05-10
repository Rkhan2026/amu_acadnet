import { withAuth, successResponse, errorResponse } from "@/lib/api-utils";
import { getFreshUser } from "@/lib/services/auth";

export const GET = withAuth(
  async (request, session) => {
    if (!session) return successResponse({ user: null });

    try {
      const user = await getFreshUser(session);
      return successResponse({ user });
    } catch (error) {
      return errorResponse(error.message, 404);
    }
  },
  { required: false },
);
