import { withAuth, successResponse, errorResponse } from "@/lib/api-utils";
import { verifyUser } from "@/lib/services/admin";

export const PATCH = withAuth(
  async (request, session, { params }) => {
    const { universityID } = await params;
    const data = await request.json();

    if (!["APPROVED", "REJECTED"].includes(data.accountStatus)) {
      return errorResponse("Invalid status", 400);
    }

    const updatedUser = await verifyUser(universityID, data);
    return successResponse(updatedUser);
  },
  { allowedRoles: ["ADMIN"] },
);
