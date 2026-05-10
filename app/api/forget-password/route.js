import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";
import { initiatePasswordReset } from "@/lib/services/auth";

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) return errorResponse("Email is required", 400);

    await initiatePasswordReset(email);
    return successResponse({
      message: "If an account exists, a password reset link has been sent.",
    });
  } catch (err) {
    return handleApiError(err, "Forget Password");
  }
}
