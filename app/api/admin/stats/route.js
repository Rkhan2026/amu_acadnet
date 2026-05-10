import { withAuth, successResponse } from "@/lib/api-utils";
import { getAdminStats } from "@/lib/services/admin";

export const GET = withAuth(
  async () => {
    const stats = await getAdminStats();
    return successResponse(stats);
  },
  { allowedRoles: ["ADMIN"] },
);
