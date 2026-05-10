import { withAuth, successResponse } from "@/lib/api-utils";
import { getPendingUsers } from "@/lib/services/admin";

export const GET = withAuth(
  async () => {
    const pendingUsers = await getPendingUsers();
    return successResponse(pendingUsers);
  },
  { allowedRoles: ["ADMIN"] },
);
