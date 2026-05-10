import { setSession } from "@/lib/session";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";
import { loginUser } from "@/lib/services/auth";

export async function POST(request) {
  try {
    const { email, password, rememberMe } = await request.json();
    if (!email || !password)
      return errorResponse("Email and password are required", 400);

    const user = await loginUser(email, password);
    await setSession(user, rememberMe);

    return successResponse({ user });
  } catch (error) {
    if (error.message === "User not found")
      return errorResponse(error.message, 404);
    if (error.message === "Invalid credentials")
      return errorResponse(error.message, 401);
    if (error.message === "Admin approval still pending")
      return errorResponse(error.message, 403);

    return handleApiError(error, "Login");
  }
}
