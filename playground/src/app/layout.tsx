import type { Metadata } from "next";
import { ThemeProvider } from "@handharr-labs/forge-ui-uno";
import "@handharr-labs/forge-ui-uno/tokens/globals.css";
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
