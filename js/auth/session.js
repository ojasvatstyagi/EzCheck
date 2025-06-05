// js/auth/session.js
export async function verifySession() {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const user = sessionStorage.getItem("user");

  if (!token || !role) {
    return { valid: false };
  }

  let parsedUser = null;
  try {
    parsedUser = user ? JSON.parse(user) : null;
  } catch {
    parsedUser = null;
  }

  return {
    valid: true,
    role,
    name: parsedUser?.name || null,
    visitorId: role === "visitor" ? parsedUser?.id : undefined,
  };
}

export function clearSession() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("user");
}
