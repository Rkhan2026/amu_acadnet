import { NextResponse } from "next/server";

export function proxy(request) {
  const nonce = btoa(crypto.randomUUID());
  const isDev = process.env.NODE_ENV === "development";

  // Relaxed style policy to allow libraries like Framer Motion and Tailwind to work
  // without style-src nonce issues, while keeping script-src secure.
  const styleSrc = "style-src 'self' 'unsafe-inline';";

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://va.vercel-scripts.com${
      isDev ? " 'unsafe-eval' 'unsafe-inline'" : ""
    };
    ${styleSrc}
    style-src-attr 'unsafe-inline';
    img-src 'self' blob: data: https://api.dicebear.com https://res.cloudinary.com;
    font-src 'self';
    connect-src 'self' https://vitals.vercel-insights.com https://api.cloudinary.com https://*.vercel.app https://*.vercel-scripts.com;
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
