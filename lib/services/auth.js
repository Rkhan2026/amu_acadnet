"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function parseAndVerifyToken(token) {
  const parts = token.split(".");
  if (parts.length !== 2) throw new Error("Invalid token format");

  const [payloadBase64, providedSignature] = parts;
  const payloadStr = Buffer.from(payloadBase64, "base64url").toString("utf-8");
  const payloadObj = JSON.parse(payloadStr);

  const { id, exp } = payloadObj;
  if (!id || !exp) throw new Error("Invalid payload");
  if (Date.now() > exp) throw new Error("Token expired");

  return { id, payloadBase64, providedSignature };
}

export async function verifyUserSignature(
  id,
  payloadBase64,
  providedSignature,
) {
  const user = await prisma.user.findUnique({ where: { universityID: id } });
  if (!user) throw new Error("User not found");

  const secret = (process.env.JWT_SECRET || "dev-secret") + user.password;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payloadBase64)
    .digest("base64url");

  if (expectedSignature !== providedSignature) {
    throw new Error("Token invalid or already used");
  }

  return user;
}

export async function initiatePasswordReset(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const secret = (process.env.JWT_SECRET || "dev-secret") + user.password;
  const payload = Buffer.from(
    JSON.stringify({
      id: user.universityID,
      exp: Date.now() + 60 * 60 * 1000,
    }),
  ).toString("base64url");

  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  const token = `${payload}.${signature}`;

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const resetLink = `${baseUrl}/reset-password?token=${token}`;
  await sendPasswordResetEmail(user, email, resetLink);
  return true;
}

export async function sendPasswordResetEmail(user, email, resetLink) {
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_RESET_PASSWORD;
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.NEXT_PUBLIC_EMAILJS_PRIVATE_KEY;

  if (!templateId || !serviceId || !publicKey || !privateKey) {
    throw new Error("Server config error: Missing EmailJS env vars");
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: {
        password_reset_link: resetLink,
        reset_link: resetLink,
        link: resetLink,
        message: resetLink,
        email: email,
        to_name: user.name,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("EmailJS API error:", err);
    throw new Error("Failed to send email");
  }

  return true;
}

export async function registerUser(data, profilePhotoUrl, identityProofUrl) {
  const {
    universityID,
    name,
    email,
    password,
    role,
    department,
    domain,
    biography,
  } = data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { universityID }] },
  });
  if (existing) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      universityID,
      name,
      email,
      password: hashedPassword,
      role,
      department,
      accountStatus: "PENDING",
      identityProof: identityProofUrl,
      profilePhoto: profilePhotoUrl,
      academicProfile: {
        create: {
          interestsSkills: domain ? [domain.toLowerCase()] : [],
          biography: biography || "",
        },
      },
    },
  });
}

export async function loginUser(email, password) {
  const adminUser = await prisma.admin.findUnique({ where: { email } });
  if (adminUser) {
    const match = await bcrypt.compare(password, adminUser.password);
    if (!match) throw new Error("Invalid credentials");
    return {
      adminID: adminUser.adminID,
      name: adminUser.name,
      email: adminUser.email,
      role: "ADMIN",
    };
  }

  const standardUser = await prisma.user.findUnique({ where: { email } });
  if (!standardUser) throw new Error("User not found");

  const match = await bcrypt.compare(password, standardUser.password);
  if (!match) throw new Error("Invalid credentials");

  if (standardUser.accountStatus === "PENDING") {
    throw new Error("Admin approval still pending");
  }

  return {
    universityID: standardUser.universityID,
    name: standardUser.name,
    email: standardUser.email,
    role: standardUser.role,
    accountStatus: standardUser.accountStatus,
    department: standardUser.department,
  };
}

export async function resetUserPassword(token, newPassword) {
  const { id, payloadBase64, providedSignature } = parseAndVerifyToken(token);
  const user = await verifyUserSignature(id, payloadBase64, providedSignature);

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  return await prisma.user.update({
    where: { universityID: user.universityID },
    data: { password: hashedPassword },
  });
}

export async function getFreshUser(session) {
  if (session.role === "ADMIN") {
    const admin = await prisma.admin.findUnique({
      where: { adminID: session.adminID },
    });
    if (!admin) throw new Error("User not found");
    return { ...session };
  }

  const user = await prisma.user.findUnique({
    where: { universityID: session.universityID },
  });
  if (!user) throw new Error("User not found");

  return {
    ...session,
    profilePhoto: user.profilePhoto,
    accountStatus: user.accountStatus,
  };
}
