import { withAuth, successResponse } from "@/lib/api-utils";
import { getNetworkData } from "@/lib/services/network";

export const GET = withAuth(
  async (request, session) => {
    if (!session)
      return successResponse({
        currentUser: null,
        sentCollaborations: [],
        receivedCollaborations: [],
        following: [],
        followers: [],
      });

    const { universityID, adminID, name } = session;

    if (adminID) {
      return successResponse({
        currentUser: { name, universityID: adminID, role: "ADMIN" },
        sentCollaborations: [],
        receivedCollaborations: [],
        following: [],
        followers: [],
      });
    }

    const networkData = await getNetworkData(universityID);
    return successResponse(networkData);
  },
  { required: false },
);
