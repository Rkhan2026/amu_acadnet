import { successResponse, errorResponse } from "@/lib/api-utils";
import {
  parseAndVerifyToken,
  verifyUserSignature,
  resetUserPassword,
} from "@/lib/services/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    if (!token) return errorResponse("No token provided", 400);

    const { id, payloadBase64, providedSignature } =
      await parseAndVerifyToken(token);
    await verifyUserSignature(id, payloadBase64, providedSignature);

    return successResponse({ valid: true });
  } catch (err) {
    return errorResponse(err.message, 400);
  }
}

export async function POST(request) {
  try {
    const { token, newPassword } = await request.json();
    if (!token || !newPassword)
      return errorResponse("Token and new password required.", 400);

    await resetUserPassword(token, newPassword);
    return successResponse({ message: "Password reset successfully." });
  } catch (err) {
    return errorResponse(err.message, 400);
  }
}
