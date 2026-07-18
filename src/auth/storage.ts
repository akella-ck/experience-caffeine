import { AUTH_STORAGE_KEYS } from "../config/demo-auth";

export type SessionStorageTarget = Pick<Storage, "removeItem">;

export function clearStoredSessions(
  localStorage: SessionStorageTarget | null,
  sessionStorage: SessionStorageTarget | null,
) {
  try {
    localStorage?.removeItem(AUTH_STORAGE_KEYS.local);
  } catch {
    // Logout should still clear the other storage area when one is unavailable.
  }
  try {
    sessionStorage?.removeItem(AUTH_STORAGE_KEYS.session);
  } catch {
    // The in-memory session is cleared by AuthProvider regardless of storage support.
  }
}
