import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lux - Event Management",
    template: "%s | Lux",
  },
  description:
    "Lux is a modern event management platform for creating, managing, and attending events.",
  keywords: ["events", "event management", "invitations", "gatherings"],
  authors: [{ name: "Lux Team" }],
  creator: "Lux",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://lux.app",
    title: "Lux - Event Management",
    description:
      "Lux is a modern event management platform for creating, managing, and attending events.",
    siteName: "Lux",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lux - Event Management",
    description:
      "Lux is a modern event management platform for creating, managing, and attending events.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
