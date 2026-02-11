import { Geist, Geist_Mono } from "next/font/google"; // Leave fonts as is
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AMU AcadNet",
  description: "Institutional Academic Social Network for AMU",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 flex flex-col min-h-screen`}
      >
        <Analytics />
        {children}
      </body>
    </html>
  );
}
