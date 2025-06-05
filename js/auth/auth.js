// js/auth/auth.js
import {
  renderLoginForm,
  renderRegisterForm,
  renderOTPForm,
} from "../views/authView.js";
import AuthService from "../../api/authApi.js";

const authContainer = document.getElementById("authContainer");

// Initialize auth views
let currentView = "login";
let currentEmail = "";
let currentRole = "";

// Render appropriate view
function renderView() {
  switch (currentView) {
    case "login":
      authContainer.innerHTML = renderLoginForm();
      setupLoginListeners();
      break;
    case "register":
      authContainer.innerHTML = renderRegisterForm();
      setupRegisterListeners();
      break;
    case "otp":
      authContainer.innerHTML = renderOTPForm(currentEmail);
      setupOTPListeners();
      break;
  }
}

// Setup event listeners for each view
function setupLoginListeners() {
  document.getElementById("toggleToRegister").addEventListener("click", () => {
    currentView = "register";
    renderView();
  });

  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await AuthService.login(email, password);
      if (response.success) {
        window.location.href = "dashboard.html";
      } else {
        showAlert(response.message || "Login failed", "danger");
      }
    } catch (error) {
      showAlert("An error occurred during login", "danger");
    }
  });
}

function setupRegisterListeners() {
  document.getElementById("toggleToLogin").addEventListener("click", () => {
    currentView = "login";
    renderView();
  });

  document
    .getElementById("registerForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("registerName").value;
      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;
      const role = document.getElementById("registerRole").value;

      try {
        const response = await AuthService.register(
          name,
          email,
          password,
          role
        );
        if (response.success) {
          currentEmail = email;
          currentRole = role;
          currentView = "otp";
          renderView();
        } else {
          showAlert(response.message || "Registration failed", "danger");
        }
      } catch (error) {
        showAlert("An error occurred during registration", "danger");
      }
    });
}

function setupOTPListeners() {
  document.getElementById("resendOTP").addEventListener("click", async () => {
    try {
      const response = await AuthService.resendOTP(currentEmail);
      if (response.success) {
        showAlert("New OTP sent successfully", "success");
      } else {
        showAlert(response.message || "Failed to resend OTP", "danger");
      }
    } catch (error) {
      showAlert("An error occurred while resending OTP", "danger");
    }
  });

  document
    .getElementById("verifyOTPForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const otp = Array.from(
        { length: 6 },
        (_, i) => document.getElementById(`otp-${i}`).value
      ).join("");

      try {
        const response = await AuthService.verifyOTP(currentEmail, otp);
        if (response.success) {
          showAlert("Email verified successfully!", "success");
          setTimeout(() => {
            currentView = "login";
            renderView();
          }, 1500);
        } else {
          showAlert(response.message || "Invalid OTP", "danger");
        }
      } catch (error) {
        showAlert("An error occurred during verification", "danger");
      }
    });
}

// Helper function to show alerts
function showAlert(message, type) {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} mt-3`;
  alertDiv.textContent = message;
  authContainer.prepend(alertDiv);
  setTimeout(() => alertDiv.remove(), 3000);
}

// Initialize the first view
renderView();
