import { NextResponse } from "next/server";

export function proxy(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const isPreview = process.env.VERCEL_ENV === "preview";

  // In preview deployments Vercel injects feedback.js which creates <style>
  // elements without a nonce — use 'unsafe-inline' there instead.
  // In production the strict nonce-only policy is kept.
  const styleSrc = isPreview
    ? `style-src 'self' 'unsafe-inline';`
    : `style-src 'self' 'nonce-${nonce}';`;

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://va.vercel-scripts.com${isDev ? " 'unsafe-eval'" : ""};
    ${styleSrc}
    style-src-attr 'unsafe-inline';
    img-src 'self' blob: data: https://api.dicebear.com;
    font-src 'self';
    connect-src 'self' https://vitals.vercel-insights.com;
    frame-src 'self' https://vercel.live;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
