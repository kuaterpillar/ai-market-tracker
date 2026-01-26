import type { Metadata } from "next";
import "./globals.css";
import Analytics from "@/components/Analytics";

export const metadata: Metadata = {
  title: "AI Marketing Tools Tracker - Latest Tools to Grow Your Business",
  description: "Discover the latest AI-powered marketing and e-commerce tools. Updated daily with curated tools to boost sales, automate marketing, and grow your online business.",
  keywords: "AI marketing tools, e-commerce automation, sales tools, marketing automation, AI copywriting, SEO tools",
  openGraph: {
    title: "AI Marketing Tools Tracker",
    description: "Daily curated AI tools for marketing and e-commerce",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
