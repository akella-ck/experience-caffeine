import type { DemoCredential } from "../auth/types";

/**
 * WARNING: DEMO CREDENTIALS ONLY — THIS MUST NOT BE USED IN PRODUCTION.
 * A real deployment must use Supabase Auth, Auth.js, Clerk, or another secure
 * identity provider with server-side authorization. Passwords must never be
 * stored in frontend source code in a real deployment. These client-visible
 * credentials and browser sessions provide no security and exist only to let
 * reviewers switch between demo roles.
 */
export const DEMO_CREDENTIALS = [
  {
    role: "individual",
    email: "test@experiencecaffeine.com",
    password: "coffeeistheanswer",
    displayName: "Maya Chen",
    accountName: "Individual member",
  },
  {
    role: "corporate",
    email: "cafe@experiencecaffeine.com",
    password: "whatsyourorder",
    displayName: "Elena Ruiz",
    accountName: "Northline Coffee Group",
  },
] as const satisfies readonly DemoCredential[];

export const DEMO_AUTH_ENABLED = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const AUTH_STORAGE_KEYS = {
  local: "experience-caffeine-demo-auth-local-v1",
  session: "experience-caffeine-demo-auth-session-v1",
} as const;
