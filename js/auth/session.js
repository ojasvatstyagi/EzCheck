// js/auth/session.js
export async function verifySession() {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const userString = sessionStorage.getItem("user");

  // If token or role are missing, session is not valid (client-side check)
  if (!token || !role) {
    return { valid: false, role: null, name: null, visitorId: undefined };
  }

  let parsedUser = null;
  try {
    parsedUser = userString ? JSON.parse(userString) : null;
  } catch (e) {
    console.error("Error parsing user data from sessionStorage:", e);
    // If user data is corrupted, invalidate session for safety
    clearSession(); // Clear corrupted session data
    return { valid: false, role: null, name: null, visitorId: undefined };
  }

  // A minimal check: if userString exists but parsedUser is null (due to bad JSON), invalidate
  if (userString && parsedUser === null) {
    return { valid: false, role: null, name: null, visitorId: undefined };
  }

  // Session is considered valid client-side if token and role exist, and user data is parsable
  return {
    valid: true,
    role: role,
    name: parsedUser?.name || null, // Ensure name is null if not present
    visitorId: role === "visitor" && parsedUser?.id ? parsedUser.id : undefined, // Ensure ID is present if role is visitor
  };
}

/**
 * Clears all authentication-related data from sessionStorage.
 */
export function clearSession() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("user");
  // You might also want to clear any other session-specific data here.
}
