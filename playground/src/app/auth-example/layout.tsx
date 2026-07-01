"use client";

import { authClient } from "@/lib/auth-client";

/**
 * Reference: mount `<AuthProvider>` once so `useSession` works below it.
 * In a real app this goes in the root layout.
 */
export default function AuthExampleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <authClient.AuthProvider>{children}</authClient.AuthProvider>;
}
