import type { Metadata, Viewport } from "next";
import "./globals.css";
import { event } from "@/data/event";

export const metadata: Metadata = {
  title: `${event.title} - ${event.church} ${event.ministry}`,
  description: `${event.subTitle} | ${event.displayDate} ${event.location}`,
  manifest: "/manifest.json",
  icons: {
    icon: "/characters/shinchan.png",
    apple: "/characters/shinchan.png",
  },
  openGraph: {
    title: `${event.title} - ${event.church} ${event.ministry}`,
    description: `${event.subTitle} | ${event.displayDate} ${event.location}`,
    images: ["/characters/shinchan.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFF34F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="h-full antialiased bg-crayon-bg text-crayon-text selection:bg-crayon-pink selection:text-white paper-dots">
        {children}
      </body>
    </html>
  );
}
