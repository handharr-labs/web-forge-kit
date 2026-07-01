"use client";

import { authClient } from "@/lib/auth-client";

/**
 * Reference login/session UI — provider-agnostic. The button is a plain inline
 * element wired to `authClient.signIn('google')` (the `ui-base` `SignInButton`
 * molecule is deferred). Swap the adapter and this page does not change.
 *
 * NOTE: this static-export playground has no auth backend, so `useSession` stays
 * `unauthenticated` and sign-in has nowhere to redirect. It demonstrates the
 * client wiring shape; a live flow needs a server runtime + the route handler.
 */
export default function AuthExamplePage() {
  const { status, user } = authClient.useSession();

  return (
    <main style={{ maxWidth: 520, margin: "4rem auto", fontFamily: "system-ui" }}>
      <h1>web-auth reference</h1>
      <p>
        Session status: <strong>{status}</strong>
      </p>

      {status === "authenticated" && user ? (
        <div>
          <p>Signed in as {user.email}</p>
          <button type="button" onClick={() => authClient.signOut({ redirectTo: "/auth-example" })}>
            Sign out
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={status === "loading"}
          onClick={() => authClient.signIn("google", { redirectTo: "/auth-example" })}
        >
          Sign in with Google
        </button>
      )}
    </main>
  );
}
