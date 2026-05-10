import { deleteSession } from "@/lib/session";
import { successResponse } from "@/lib/api-utils";

export async function POST() {
  await deleteSession();
  return successResponse({ success: true, message: "Logged out successfully" });
}
