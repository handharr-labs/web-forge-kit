import type { Metadata } from "next";
import { ThemeProvider } from "@handharr-labs/ui-xpnsio";
import "@handharr-labs/ui-xpnsio/tokens/globals.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forgekit — Design System Catalog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
