import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Lookup user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // To prevent email enumeration, we respond generically even if the user is not found.
    if (!user) {
      return NextResponse.json(
        {
          message: "If an account exists, a password reset link has been sent.",
        },
        { status: 200 },
      );
    }

    // Generate a secure, stateless token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("Missing JWT_SECRET env var");
      return NextResponse.json(
        { error: "Server config error" },
        { status: 500 },
      );
    }

    // Combine system secret with the user's specific state (current password hash)
    const secret = jwtSecret + user.password;

    // Create base64url encoded payload
    // Expiration is set to 1 hour from now
    const payloadObj = {
      id: user.universityID,
      exp: Date.now() + 60 * 60 * 1000,
    };
    const payload = Buffer.from(JSON.stringify(payloadObj)).toString(
      "base64url",
    );

    // Create signature
    const signature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("base64url");

    const token = `${payload}.${signature}`;

    // Determine base URL dynamically
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const resetLink = `${baseUrl}/reset_password?token=${token}`;

    // EmailJS config
    const templateId =
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_RESET_PASSWORD;
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.NEXT_PUBLIC_EMAILJS_PRIVATE_KEY;

    if (!templateId || !serviceId || !publicKey || !privateKey) {
      console.error("Missing EmailJS env vars");
      return NextResponse.json(
        { error: "Server config error" },
        { status: 500 },
      );
    }

    // Send email with AbortController
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
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
            to_name: user.name, // optionally send name if template supports it
          },
        }),
        signal: controller.signal,
      },
    );

    clearTimeout(timeout);

    if (!response.ok) {
      const err = await response.text();
      console.error("EmailJS API error:", err);
      return NextResponse.json(
        { error: "Failed to send email. Please try again later." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "If an account exists, a password reset link has been sent." },
      { status: 200 },
    );
  } catch (err) {
    console.error("API error:", err);

    if (err.name === "AbortError") {
      return NextResponse.json(
        { error: "Email service timeout" },
        { status: 504 },
      );
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
