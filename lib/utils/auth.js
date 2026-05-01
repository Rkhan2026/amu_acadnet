// utils/auth.js

// Browser check (reusable)
const isBrowser = () => typeof window !== "undefined";

/**
 * Checks if a user is logged in.
 * Use this inside `useEffect` or within client components.
 */
export function isLoggedIn() {
  if (!isBrowser()) return false;
  return !!localStorage.getItem("currentUser");
}

/**
 * Gets the currently logged-in user from localStorage.
 * Use this only inside `useEffect` or in a custom hook like `useAuth()`
 */
export function getCurrentUser() {
  if (!isBrowser()) return null;

  try {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  } catch (_error) {
    return null;
  }
}

/**
 * Sets the current user in localStorage upon login/register
 */
export function setCurrentUser(user) {
  if (isBrowser()) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }
}

/**
 * Removes the current user from localStorage on logout
 */
export function clearCurrentUser() {
  if (isBrowser()) {
    localStorage.removeItem("currentUser");
  }
}

/**
 * Notifies other components that the user state has changed
 */
export function notifyUserChange() {
  if (isBrowser()) {
    window.dispatchEvent(new Event("user-updated"));
  }
}
