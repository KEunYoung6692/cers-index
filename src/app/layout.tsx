import type { ReactNode } from "react";
import AppProviders from "../App";
import "../index.css";

export const metadata = {
  title: {
    default: "CERs Index",
    template: "%s | CERs Index",
  },
  description:
    "Public-evidence climate transition intelligence for comparing corporate decarbonization, targets, capital allocation, and data credibility.",
  openGraph: {
    title: "CERs Index",
    description:
      "Compare corporate climate transition quality through a public-evidence, four-KPI index.",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
