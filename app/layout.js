import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AMU AcadNet - Institutional Academic Social Network",
  description:
    "An Institutional Academic Social Network and Collaboration System for Aligarh Muslim University",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
