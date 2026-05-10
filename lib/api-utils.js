import { NextResponse } from "next/server";
import { getSession } from "./session";

/**
 * Standardized error response
 */
export function errorResponse(message, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Standardized success response
 */
export function successResponse(data, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Standardized error handler for catch blocks
 */
export function handleApiError(error, context = "API") {
  console.error(`${context} Error:`, error);
  return errorResponse("Internal server error", 500);
}

/**
 * Higher-order function for authenticated routes
 */
export function withAuth(handler, options = {}) {
  const { allowedRoles = [], required = true } = options;

  return async (request, context) => {
    try {
      const session = await getSession();
      if (required && !session) {
        return errorResponse("Unauthorized", 401);
      }

      if (session && allowedRoles.length > 0) {
        const userRole = session.role?.toUpperCase();
        const upperAllowedRoles = allowedRoles.map((r) => r.toUpperCase());
        if (!upperAllowedRoles.includes(userRole)) {
          return errorResponse("Forbidden", 403);
        }
      }

      return await handler(request, session, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

/**
 * Common Prisma select fragments for consistency
 */
export const USER_SAFE_SELECT = {
  universityID: true,
  name: true,
  email: true,
  department: true,
  role: true,
  accountStatus: true,
  profilePhoto: true,
};

export const PROJECT_SAFE_SELECT = {
  projectID: true,
  title: true,
  description: true,
  projectDomain: true,
  projectStatus: true,
  createdAt: true,
  moderationStatus: true,
  universityID: true,
};

/**
 * Normalizes tags/skills/requirements to lowercase array
 */
export function normalizeTags(input) {
  if (!input) return [];
  if (Array.isArray(input))
    return input.map((i) => i.toString().trim().toLowerCase()).filter(Boolean);
  if (typeof input === "string")
    return input
      .split(",")
      .map((i) => i.trim().toLowerCase())
      .filter(Boolean);
  return [];
}
