import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const SESSION_LONG_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

const base64UrlEncode = (value) =>
  Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const base64UrlDecode = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (normalized.length % 4)) % 4;
  return Buffer.from(`${normalized}${"=".repeat(padding)}`, "base64").toString(
    "utf8",
  );
};

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET || process.env.AUTH_SECRET;

  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") {
    return "dev-insecure-jwt-secret-change-me";
  }

  throw new Error("JWT_SECRET is not configured");
};

const signJwt = (payload, ttlSeconds = SESSION_TTL_SECONDS) => {
  const now = Math.floor(Date.now() / 1000);
  const body = {
    ...payload,
    iat: now,
    exp: now + ttlSeconds,
  };

  const encodedHeader = base64UrlEncode(
    JSON.stringify({ alg: "HS256", typ: "JWT" }),
  );
  const encodedPayload = base64UrlEncode(JSON.stringify(body));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac("sha256", getJwtSecret())
    .update(unsignedToken)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${unsignedToken}.${signature}`;
};

const verifyJwt = (token) => {
  const [encodedHeader, encodedPayload, signature] = token.split(".");
  if (!encodedHeader || !encodedPayload || !signature) return null;

  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = crypto
    .createHmac("sha256", getJwtSecret())
    .update(unsignedToken)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const actualSignature = Buffer.from(signature);
  const computedSignature = Buffer.from(expectedSignature);

  if (
    actualSignature.length !== computedSignature.length ||
    !crypto.timingSafeEqual(actualSignature, computedSignature)
  ) {
    return null;
  }

  try {
    const header = JSON.parse(base64UrlDecode(encodedHeader));
    const payload = JSON.parse(base64UrlDecode(encodedPayload));

    if (header.alg !== "HS256" || header.typ !== "JWT") return null;
    if (typeof payload.exp !== "number") return null;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;

    const { exp: _exp, iat: _iat, ...sessionUser } = payload;
    return sessionUser;
  } catch (_error) {
    return null;
  }
};

export const setSession = async (user, isRememberMe = false) => {
  const ttl = isRememberMe ? SESSION_LONG_TTL_SECONDS : SESSION_TTL_SECONDS;
  const token = signJwt(user, ttl);

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: ttl,
    path: "/",
  });
};

export const getSession = async () => {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyJwt(token);
};

export const deleteSession = async () => {
  (await cookies()).delete(COOKIE_NAME);
};

/**
 * Returns a standardized authentication context.
 * Useful for APIs that support both Guest and Member views.
 */
export const getAuthContext = async () => {
  const session = await getSession();
  return {
    session,
    isAuthenticated: !!session,
    isGuest: !session,
    universityID: session?.universityID || null,
    role: session?.role || "GUEST",
  };
};

/**
 * Generates a deterministic hash of an ID using the JWT secret.
 * Used for secure file naming.
 */
export const getHashedId = (id) => {
  if (!id) return "anonymous";
  return crypto
    .createHmac("sha256", getJwtSecret())
    .update(id.toString())
    .digest("hex");
};
