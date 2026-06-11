import type { ReactNode } from "react";
import AppProviders from "../App";
import "../index.css";

export const metadata = {
  title: {
    default: "CERs Index",
    template: "%s | CERs Index",
  },
  description: "Public-facing dashboard for comparing corporate carbon reduction performance.",
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
