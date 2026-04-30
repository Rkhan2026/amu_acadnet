import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token)
      return NextResponse.json({ error: "No token provided" }, { status: 400 });

    const parts = token.split(".");
    if (parts.length !== 2)
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });

    const [payloadBase64, providedSignature] = parts;
    let payloadObj;
    try {
      const payloadStr = Buffer.from(payloadBase64, "base64url").toString(
        "utf-8",
      );
      payloadObj = JSON.parse(payloadStr);
    } catch (_e) {
      return NextResponse.json({ error: "Malformed token" }, { status: 400 });
    }

    const { id, exp } = payloadObj;
    if (!id || !exp)
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    if (Date.now() > exp)
      return NextResponse.json({ error: "Token expired" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { universityID: id } });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const secret = process.env.JWT_SECRET + user.password;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payloadBase64)
      .digest("base64url");

    if (expectedSignature !== providedSignature) {
      return NextResponse.json(
        { error: "Token invalid or already used" },
        { status: 400 },
      );
    }

    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (_err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password required." },
        { status: 400 },
      );
    }

    // Parse the token
    const parts = token.split(".");
    if (parts.length !== 2) {
      return NextResponse.json(
        { error: "Invalid token format." },
        { status: 400 },
      );
    }

    const [payloadBase64, providedSignature] = parts;

    let payloadObj;
    try {
      const payloadStr = Buffer.from(payloadBase64, "base64url").toString(
        "utf-8",
      );
      payloadObj = JSON.parse(payloadStr);
    } catch (_e) {
      return NextResponse.json({ error: "Malformed token." }, { status: 400 });
    }

    const { id, exp } = payloadObj;

    if (!id || !exp) {
      return NextResponse.json(
        { error: "Invalid token payload." },
        { status: 400 },
      );
    }

    // Check expiration
    if (Date.now() > exp) {
      return NextResponse.json(
        { error: "Token has expired." },
        { status: 400 },
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { universityID: id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json(
        { error: "Server config error" },
        { status: 500 },
      );
    }

    // Reconstruct the secret
    const secret = jwtSecret + user.password;

    // Reconstruct signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payloadBase64)
      .digest("base64url");

    if (expectedSignature !== providedSignature) {
      // Signature mismatch - either tampered token or password was already changed
      return NextResponse.json(
        { error: "Invalid token. This token may have already been used." },
        { status: 400 },
      );
    }

    // Token is valid! Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update local password
    await prisma.user.update({
      where: { universityID: user.universityID },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { message: "Password reset successfully." },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error resetting password:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
