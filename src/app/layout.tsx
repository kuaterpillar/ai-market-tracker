import type { Metadata } from "next";
import "./globals.css";
import Analytics from "@/components/Analytics";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "AI Marketing Tools Tracker - Boost Revenue by 300% | Updated Daily",
  description: "Discover 100+ AI marketing tools to automate content, optimize SEO, and skyrocket your revenue. Updated daily. 2,847+ marketers trust us. 100% Free.",
  keywords: "AI marketing tools, marketing automation, AI copywriting, SEO tools, content automation, email marketing AI, social media automation, conversion optimization, AI analytics, growth hacking tools",
  authors: [{ name: "AI Market Tracker" }],
  creator: "AI Market Tracker",
  publisher: "AI Market Tracker",
  robots: "index, follow",
  openGraph: {
    title: "AI Marketing Tools Tracker - Boost Revenue by 300%",
    description: "100+ AI tools to automate your marketing. Updated daily. Join 2,847+ marketers.",
    type: "website",
    siteName: "AI Market Tracker",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Marketing Tools Tracker - Boost Revenue by 300%",
    description: "100+ AI tools to automate your marketing. Updated daily.",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-market-tracker.vercel.app'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body className="antialiased">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
