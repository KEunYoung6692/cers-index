import type { ReactNode } from "react";
import AppProviders from "../App";
import "../index.css";

export const metadata = {
  title: "CERS Index",
  description: "CERS Index dashboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
