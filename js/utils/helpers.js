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
      return "bg-info text-dark";
    case "Checked-In":
      return "bg-success";
    case "Completed":
      return "bg-secondary";
    case "Cancelled":
      return "bg-danger";
    case "Pending":
      return "bg-warning text-dark";
    case "Declined":
      return "bg-danger";
    default:
      return "bg-light text-dark";
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
  const canvas = document.getElementById(elementId);
  if (!canvas || !canvas.getContext) return;

  if (process.env.NODE_ENV === "production") {
    const QRCode = await import("qrcode");
    QRCode.toCanvas(
      canvas,
      text,
      {
        width: size,
        margin: 2,
        color: {
          dark: "#000",
          light: "#fff",
        },
      },
      (error) => {
        if (error) console.error(error);
      }
    );
  } else {
    const ctx = canvas.getContext("2d");
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#000";
    ctx.font = "10px Arial";
    ctx.fillText("QR Code Mock", 10, size / 2);
    ctx.fillText(text.substring(0, 15) + "...", 10, size / 2 + 15);
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
