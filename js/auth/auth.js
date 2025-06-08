// js/auth/auth.js
import {
  renderLoginForm,
  renderRegisterForm,
  renderOTPForm,
} from "../views/authView.js";
import AuthService from "../../api/authApi.js";

const authContainer = document.getElementById("authContainer");
const initialAlertTimeout = 3000;

let currentView = "login";
let currentEmail = ""; // Stores email for OTP verification/resend
let currentRole = ""; // Stores role if needed for post-registration flow
// --- Alert Handling ---
function showAlert(message, type) {
  // Remove any existing alerts to prevent stacking
  const existingAlert = authContainer.querySelector(".alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} mt-3 text-center`;
  alertDiv.textContent = message;
  authContainer.prepend(alertDiv);
  setTimeout(() => alertDiv.remove(), initialAlertTimeout);
}

// --- Button Loading State Management ---
function setButtonLoading(
  buttonElement,
  isLoading,
  loadingText = "Loading...",
  originalText = "Submit"
) {
  if (!buttonElement) return;

  if (isLoading) {
    buttonElement.disabled = true;
    buttonElement.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>${loadingText}`;
  } else {
    buttonElement.disabled = false;
    buttonElement.innerHTML = originalText;
  }
}

// --- View Rendering Logic ---
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
      setupOTPListeners(); // This will now correctly initialize OTP inputs
      break;
    default:
      console.error("Unknown view:", currentView);
      currentView = "login"; // Fallback to login
      renderView();
  }
}

// --- Event Listener Setups ---
function setupLoginListeners() {
  const toggleToRegisterBtn = document.getElementById("toggleToRegister");
  const loginForm = document.getElementById("loginForm");
  const loginButton = loginForm.querySelector('button[type="submit"]');
  const originalLoginBtnText = loginButton.innerHTML;

  toggleToRegisterBtn.addEventListener("click", () => {
    currentView = "register";
    renderView();
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    setButtonLoading(loginButton, true, "Logging in...", originalLoginBtnText);

    try {
      const response = await AuthService.login(email, password);
      if (response.success) {
        window.location.href = "dashboard.html";
      } else {
        showAlert(
          response.message || "Login failed. Please check your credentials.",
          "danger"
        );
      }
    } catch (error) {
      console.error("Login attempt failed:", error);
      showAlert("A network error occurred. Please try again.", "danger");
    } finally {
      setButtonLoading(
        loginButton,
        false,
        "Logging in...",
        originalLoginBtnText
      ); // Revert loading state
    }
  });
}

function setupRegisterListeners() {
  const toggleToLoginBtn = document.getElementById("toggleToLogin");
  const registerForm = document.getElementById("registerForm");
  const registerButton = registerForm.querySelector('button[type="submit"]');
  const originalRegisterBtnText = registerButton.innerHTML;

  toggleToLoginBtn.addEventListener("click", () => {
    currentView = "login";
    renderView();
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const role = document.getElementById("registerRole").value;

    if (!name || !email || !password || !role) {
      showAlert("All fields are required.", "danger");
      return;
    }
    if (password.length < 6) {
      showAlert("Password must be at least 6 characters long.", "danger");
      return;
    }
    // Basic email format check (more robust validation should be on backend)
    if (!/\S+@\S+\.\S+/.test(email)) {
      showAlert("Please enter a valid email address.", "danger");
      return;
    }

    setButtonLoading(
      registerButton,
      true,
      "Registering...",
      originalRegisterBtnText
    );

    try {
      const response = await AuthService.register(name, email, password, role);
      if (response.success) {
        currentEmail = email; // Store email for OTP verification
        currentRole = role; // Store role (if needed for later use, e.g., dashboard setup)
        showAlert(
          "Registration successful! Please verify your email with the OTP.",
          "success"
        );
        setTimeout(() => {
          currentView = "otp";
          renderView();
        }, 1500); // Give user time to read success message
      } else {
        showAlert(
          response.message || "Registration failed. Please try again.",
          "danger"
        );
      }
    } catch (error) {
      console.error("Registration attempt failed:", error);
      showAlert(
        "A network error occurred during registration. Please try again.",
        "danger"
      );
    } finally {
      setButtonLoading(
        registerButton,
        false,
        "Registering...",
        originalRegisterBtnText
      ); // Revert loading state
    }
  });
}

function setupOTPListeners() {
  const otpInputs = document.querySelectorAll(".otp-input");
  const resendOtpBtn = document.getElementById("resendOTP");
  const verifyOtpForm = document.getElementById("verifyOTPForm");
  const verifyButton = verifyOtpForm.querySelector('button[type="submit"]');
  const originalVerifyBtnText = verifyButton.innerHTML;

  // Initial focus on the first OTP input
  if (otpInputs.length > 0) {
    otpInputs[0].focus();
  }

  otpInputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      // Ensure only one digit and is a number
      e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
      if (e.target.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      } else if (
        e.target.value.length === 1 &&
        index === otpInputs.length - 1
      ) {
        e.target.blur(); // Blur on last digit entry
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace") {
        if (e.target.value.length === 0 && index > 0) {
          otpInputs[index - 1].focus();
          otpInputs[index - 1].value = ""; // Clear previous input
        } else if (e.target.value.length === 1) {
          e.target.value = ""; // Clear current input
          e.preventDefault(); // Prevent default backspace if input had a value
        }
      } else if (e.key === "Delete" && e.target.value.length === 1) {
        e.target.value = "";
        e.preventDefault();
      }
    });

    // Optional: select text when input gains focus for easier replacement
    input.addEventListener("focus", (e) => {
      e.target.select();
    });
  });

  // Resend OTP click handler
  resendOtpBtn.addEventListener("click", async () => {
    // Disable resend button to prevent spamming
    resendOtpBtn.disabled = true;
    resendOtpBtn.textContent = "Sending...";

    try {
      const response = await AuthService.resendOTP(currentEmail);
      if (response.success) {
        showAlert("New OTP sent successfully!", "success");
        // Clear OTP fields for new entry
        otpInputs.forEach((input) => (input.value = ""));
        if (otpInputs.length > 0) otpInputs[0].focus();
      } else {
        showAlert(response.message || "Failed to resend OTP.", "danger");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      showAlert("A network error occurred while resending OTP.", "danger");
    } finally {
      // Re-enable resend button after a delay (e.g., 30 seconds) to prevent spam
      setTimeout(() => {
        resendOtpBtn.disabled = false;
        resendOtpBtn.textContent = "Resend OTP";
      }, 30000); // 30 seconds cooldown
    }
  });

  // OTP form submit handler
  verifyOtpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const otp = Array.from(otpInputs)
      .map((input) => input.value)
      .join("");

    // Basic OTP length validation
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      showAlert("Please enter a valid 6-digit OTP.", "danger");
      return;
    }

    setButtonLoading(verifyButton, true, "Verifying...", originalVerifyBtnText); // Show loading state

    try {
      const response = await AuthService.verifyOTP(currentEmail, otp);
      if (response.success) {
        showAlert(
          "Email verified successfully! You can now log in.",
          "success"
        );
        // Clear stored email and role after successful verification
        currentEmail = "";
        currentRole = "";
        // Redirect to login form after a short delay
        setTimeout(() => {
          currentView = "login";
          renderView();
        }, 1500);
      } else {
        showAlert(
          response.message || "Invalid OTP. Please try again.",
          "danger"
        );
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      showAlert(
        "A network error occurred during verification. Please try again.",
        "danger"
      );
    } finally {
      setButtonLoading(
        verifyButton,
        false,
        "Verifying...",
        originalVerifyBtnText
      ); // Revert loading state
    }
  });
}

// --- Initialization ---

// Initialize the first view when the script loads
document.addEventListener("DOMContentLoaded", renderView);
