// js/auth/session.js
export async function verifySession() {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const user = sessionStorage.getItem("user");

  if (!token || !role) {
    return { valid: false };
  }

  // In production: Verify token with backend
  //   if (process.env.NODE_ENV === "production") {
  //     try {
  //       const response = await fetch("/api/auth/verify", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       if (!response.ok) {
  //         return { valid: false };
  //       }

  //       return {
  //         valid: true,
  //         role,
  //         name: JSON.parse(user)?.name,
  //       };
  //     } catch (error) {
  //       return { valid: false };
  //     }
  //   }

  // Development: Mock verification
  return {
    valid: true,
    role,
    name: user ? JSON.parse(user).name : null,
  };
}

export function clearSession() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("user");
}
