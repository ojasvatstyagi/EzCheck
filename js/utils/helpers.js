// ==================== DOM HELPERS ====================
export function showAlert(container, message, type = "success") {
  const existingAlert = container.querySelector(".alert");
  if (existingAlert) existingAlert.remove();

  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  container.prepend(alertDiv);

  setTimeout(() => {
    alertDiv.classList.remove("show");
    setTimeout(() => alertDiv.remove(), 150);
  }, 5000);
}

let loaderCount = 0;
export function showLoading(container = document.body) {
  loaderCount++;
  if (document.getElementById("loading-overlay")) return;

  const loader = document.createElement("div");
  loader.id = "loading-overlay";
  loader.className =
    "loading-overlay d-flex justify-content-center align-items-center";
  loader.innerHTML = `
    <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  `;
  loader.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 9999;
  `;
  container.appendChild(loader);
}

export function hideLoading() {
  loaderCount = Math.max(0, loaderCount - 1);
  if (loaderCount === 0) {
    const loader = document.getElementById("loading-overlay");
    if (loader) loader.remove();
  }
}

export function getStatusColor(status) {
  switch (status) {
    case "Approved":
      return "bg-info";
    case "Checked-In":
      return "bg-secondary";
    case "Completed":
      return "bg-success";
    case "Cancelled":
      return "bg-danger";
    case "Pending":
      return "bg-warning ";
    case "Declined":
      return "bg-danger";
    default:
      return "bg-light";
  }
}

// ==================== DATE/TIME HELPERS ====================
export function formatDateTime(isoString, options = {}) {
  const date = new Date(isoString);
  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const combinedOptions = { ...defaultOptions, ...options };
  return date.toLocaleString(undefined, combinedOptions);
}

// ==================== VALIDATION HELPERS ====================
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone) {
  const re = /^[6-9]\d{9}$/; // Indian format
  return re.test(phone);
}

export function validatePassword(password) {
  const re = /^(?=.*[A-Z])(?=.*\d).{6,}$/; // At least 1 uppercase and 1 digit
  return re.test(password);
}

export function validateName(name) {
  return name.trim().length >= 2;
}

// ==================== DATA HELPERS ===================
export function exportToCSV(data, filename = "export.csv") {
  const csvContent = [
    Object.keys(data[0]).join(","),
    ...data.map((item) =>
      Object.values(item)
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// ==================== QR CODE HELPERS ====================
export async function generateQRCode(elementId, text, size = 128) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with ID '${elementId}' not found.`);
    return;
  }

  try {
    element.innerHTML = "";

    new QRCode(element, {
      text: text,
      width: size,
      height: size,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  } catch (error) {
    console.error("Error generating QR Code:", error);
    element.innerHTML = `<div class="text-center p-2 border">
      <small>QR Code Content: ${text}</small>
    </div>`;
  }
}

// ==================== STORAGE HELPERS ====================
export function storeUserSession(user) {
  sessionStorage.setItem("token", user.token || "mock-token");
  sessionStorage.setItem("role", user.role);
  sessionStorage.setItem(
    "user",
    JSON.stringify({
      name: user.name,
      role: user.role,
      email: user.email,
      id: user.id,
      visitorId: user.visitorId,
    })
  );
}
export function clearUserSession() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("user");
}

export function getCurrentUser() {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function getToken() {
  return sessionStorage.getItem("token");
}

export async function verifySession() {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const userString = sessionStorage.getItem("user");

  if (!token || !role) {
    return { valid: false, role: null, name: null, visitorId: undefined };
  }

  let parsedUser = null;
  try {
    parsedUser = userString ? JSON.parse(userString) : null;
  } catch (e) {
    console.error("Error parsing user data from sessionStorage:", e);
    clearSession(); // Clear corrupted session data
    return { valid: false, role: null, name: null, visitorId: undefined };
  }

  if (userString && parsedUser === null) {
    return { valid: false, role: null, name: null, visitorId: undefined };
  }

  return {
    valid: true,
    role: role,
    name: parsedUser?.name || null,
    visitorId: role === "visitor" && parsedUser?.id ? parsedUser.id : undefined,
  };
}
