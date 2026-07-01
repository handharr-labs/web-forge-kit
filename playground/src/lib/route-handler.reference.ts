/**
 * REFERENCE ONLY — not a live route in this playground.
 *
 * This playground is a static export (`output: 'export'`), which cannot host
 * server route handlers or middleware. In a real (server-runtime) app, these are
 * the two mechanical files the framework forces — copy them verbatim.
 *
 * 1) The NextAuth route handler — one re-export:
 *
 *    // app/api/auth/[...nextauth]/route.ts
 *    import { auth } from '@/lib/auth';
 *    export const { GET, POST } = auth.handlers;
 *
 * 2) Edge route protection — one re-export (scope with a matcher):
 *
 *    // middleware.ts
 *    import { auth } from '@/lib/auth';
 *    export default auth.middleware;
 *    export const config = { matcher: ['/dashboard/:path*'] };
 *
 * The lines below are the compile-checked equivalents of (1) and (2).
 */
import { auth } from "./auth";

export const { GET, POST } = auth.handlers;
export const middleware = auth.middleware;
