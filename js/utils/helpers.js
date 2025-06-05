// ==================== DOM HELPERS ====================
export function showAlert(container, message, type = "success") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  container.prepend(alertDiv);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    alertDiv.classList.remove("show");
    setTimeout(() => alertDiv.remove(), 150);
  }, 5000);
}

export function showLoading(container = document.body) {
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
  const loader = document.getElementById("loading-overlay");
  if (loader) loader.remove();
}

export function getStatusColor(status) {
  switch (status) {
    case "Approved":
      return "success";
    case "Completed":
      return "secondary";
    case "Pending":
      return "warning";
    case "Cancelled":
      return "danger";
    case "Rejected":
      return "danger";
    default:
      return "info";
  }
}

// ==================== DATE/TIME HELPERS ====================
export function formatDateTime(date, includeTime = true) {
  if (!date) return "N/A";
  const d = new Date(date);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return d.toLocaleDateString("en-US", options);
}

// ==================== VALIDATION HELPERS ====================
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone) {
  const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{3,6}$/;
  return re.test(phone);
}

export function validatePassword(password) {
  return password.length >= 6;
}

export function validateName(name) {
  return name.trim().length >= 2;
}

// ==================== DATA HELPERS ===================

export function exportToCSV(data, filename = "export.csv") {
  const csvContent = [
    Object.keys(data[0]).join(","),
    ...data.map((item) => Object.values(item).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// ==================== QR CODE HELPERS ====================
export function generateQRCode(elementId, text, size = 128) {
  return new Promise((resolve) => {
    // In production, use a proper QR library
    if (false && process.env.NODE_ENV === "production") {
      import("qrcode").then((QRCode) => {
        QRCode.toCanvas(
          document.getElementById(elementId),
          text,
          {
            width: size,
            margin: 2,
            color: {
              dark: "#000",
              light: "#fff",
            },
          },
          resolve
        );
      });
    } else {
      // Mock QR code for development
      const canvas = document.getElementById(elementId);
      const ctx = canvas.getContext("2d");
      canvas.width = size;
      canvas.height = size;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = "#000";
      ctx.font = "10px Arial";
      ctx.fillText("QR Code Mock", 10, size / 2);
      ctx.fillText(text.substring(0, 15) + "...", 10, size / 2 + 15);
      resolve();
    }
  });
}

// ==================== STORAGE HELPERS ====================
export function storeUserSession(user) {
  sessionStorage.setItem("token", user.token || "mock-token");
  sessionStorage.setItem("role", user.role);
  sessionStorage.setItem(
    "user",
    JSON.stringify({
      name: user.name,
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
