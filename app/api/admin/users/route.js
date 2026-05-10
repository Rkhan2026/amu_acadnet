import { withAuth, successResponse } from "@/lib/api-utils";
import { getAllUsers } from "@/lib/services/admin";

export const GET = withAuth(
  async (request) => {
    const { searchParams } = new URL(request.url);
    const users = await getAllUsers(searchParams.get("accountStatus"));
    return successResponse(users);
  },
  { allowedRoles: ["ADMIN"] },
);
