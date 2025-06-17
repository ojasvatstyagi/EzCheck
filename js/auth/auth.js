// js/auth/auth.js
import {
  renderLoginForm,
  renderRegisterForm,
  renderOTPForm,
} from "../views/authView.js";
import AuthService from "../../api/authApi.js";
import {
  validatePassword,
  validateName,
  validateOTP,
  validatePhoneNumberInput, // New validation function
} from "../utils/helpers.js";

const OTP_LENGTH = 6;
const DEFAULT_COUNTRY_CODE = "+91"; // Define the default country code

const authContainer = document.getElementById("authContainer");
const initialAlertTimeout = 3000;

let currentView = "login";
let currentPhone = ""; // This will now hold the *full* phone number (e.g., +919876543210)
let currentRole = "";

function showAlert(message, type) {
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
      authContainer.innerHTML = renderOTPForm(currentPhone); // Pass currentPhone (which is full number)
      setupOTPListeners();
      break;
    default:
      console.error("Unknown view:", currentView);
      currentView = "login";
      renderView();
  }
}

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
    const phoneNumberInput = document.getElementById("loginPhone").value.trim(); // User's 10-digit input
    const password = document.getElementById("loginPassword").value;

    if (!validatePhoneNumberInput(phoneNumberInput)) {
      // Validate 10-digit input
      showAlert("Please enter a valid 10-digit phone number.", "danger");
      return;
    }

    const fullPhoneNumber = DEFAULT_COUNTRY_CODE + phoneNumberInput; // Prepend country code

    setButtonLoading(loginButton, true, "Logging in...", originalLoginBtnText);

    try {
      const response = await AuthService.login(fullPhoneNumber, password); // Pass full phone number
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
      );
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
    const name = document.getElementById("registerName").value.trim();
    const phoneNumberInput = document
      .getElementById("registerPhone")
      .value.trim(); // User's 10-digit input
    const password = document.getElementById("registerPassword").value;
    const rePassword = document.getElementById("registerRePassword").value;
    const role = document.getElementById("registerRole").value;

    if (!validateName(name)) {
      showAlert("Please enter a valid name (at least 2 characters).", "danger");
      return;
    }
    if (!validatePhoneNumberInput(phoneNumberInput)) {
      // Validate 10-digit input
      showAlert("Please enter a valid 10-digit phone number.", "danger");
      return;
    }
    if (!validatePassword(password)) {
      showAlert(
        "Password must be at least 6 characters, include 1 uppercase letter and 1 digit.",
        "danger"
      );
      return;
    }
    if (password !== rePassword) {
      showAlert("Passwords do not match.", "danger");
      return;
    }
    if (!role) {
      showAlert("Please select a role.", "danger");
      return;
    }

    const fullPhoneNumber = DEFAULT_COUNTRY_CODE + phoneNumberInput; // Prepend country code

    setButtonLoading(
      registerButton,
      true,
      "Registering...",
      originalRegisterBtnText
    );

    try {
      // Pass full phone number
      const response = await AuthService.register(
        name,
        fullPhoneNumber,
        password,
        role
      );
      if (response.success) {
        currentPhone = fullPhoneNumber; // Store full phone number for OTP verification
        currentRole = role;
        showAlert(
          "Registration successful! Please verify your phone number with the OTP.",
          "success"
        );
        setTimeout(() => {
          currentView = "otp";
          renderView();
        }, 1500);
      } else {
        showAlert(
          response.message || "Registration failed. Please try again.",
          "danger"
        );
      }
    } catch (error) {
      console.error("Registration attempt failed:", error);
      showAlert("A network error occurred. Please try again.", "danger");
    } finally {
      setButtonLoading(
        registerButton,
        false,
        "Registering...",
        originalRegisterBtnText
      );
    }
  });
}

function setupOTPListeners() {
  const otpInputs = document.querySelectorAll(".otp-input");
  const resendOtpBtn = document.getElementById("resendOTP");
  const verifyOtpForm = document.getElementById("verifyOTPForm");
  const verifyButton = verifyOtpForm.querySelector('button[type="submit"]');
  const originalVerifyBtnText = verifyButton.innerHTML;

  let otpError = false;

  if (otpInputs.length > 0) {
    otpInputs[0].focus();
  }

  otpInputs.forEach((input, index) => {
    input.setAttribute("aria-label", `OTP digit ${index + 1}`);

    input.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
      if (e.target.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      } else if (
        e.target.value.length === 1 &&
        index === otpInputs.length - 1
      ) {
        e.target.blur();
      }
    });

    input.addEventListener("paste", (e) => {
      const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");
      if (pasteData.length === OTP_LENGTH) {
        otpInputs.forEach((field, i) => (field.value = pasteData[i]));
        otpInputs[OTP_LENGTH - 1].focus();
        e.preventDefault();
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

    input.addEventListener("focus", (e) => {
      e.target.select();
      if (otpError) {
        otpInputs.forEach((i) => (i.value = ""));
        otpInputs[0].focus();
        otpError = false;
      }
    });
  });

  resendOtpBtn.addEventListener("click", async () => {
    resendOtpBtn.disabled = true;
    resendOtpBtn.textContent = "Sending...";

    try {
      const response = await AuthService.resendOTP(currentPhone); // Use currentPhone (full number)
      if (response.success) {
        showAlert("New OTP sent successfully!", "success");
        otpInputs.forEach((input) => (input.value = ""));
        if (otpInputs.length > 0) otpInputs[0].focus();
      } else {
        showAlert(response.message || "Failed to resend OTP.", "danger");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      showAlert("A network error occurred while resending OTP.", "danger");
    } finally {
      setTimeout(() => {
        resendOtpBtn.disabled = false;
        resendOtpBtn.textContent = "Resend OTP";
      }, 30000);
    }
  });

  verifyOtpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const otp = Array.from(otpInputs)
      .map((input) => input.value)
      .join("");

    if (!validateOTP(otp, OTP_LENGTH)) {
      showAlert(`Please enter a valid ${OTP_LENGTH}-digit OTP.`, "danger");
      otpError = true;
      return;
    }

    setButtonLoading(verifyButton, true, "Verifying...", originalVerifyBtnText);

    try {
      const response = await AuthService.verifyOTP(currentPhone, otp); // Use currentPhone (full number)
      if (response.success) {
        showAlert(
          "Phone number verified successfully! You can now log in.",
          "success"
        );
        currentPhone = "";
        currentRole = "";
        otpError = false;
        setTimeout(() => {
          currentView = "login";
          renderView();
        }, 1500);
      } else {
        showAlert(
          response.message || "Invalid OTP. Please try again.",
          "danger"
        );
        otpError = true;
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      showAlert(
        "A network error occurred during verification. Please try again.",
        "danger"
      );
      otpError = true;
    } finally {
      setButtonLoading(
        verifyButton,
        false,
        "Verifying...",
        originalVerifyBtnText
      );
    }
  });
}

document.addEventListener("DOMContentLoaded", renderView);
