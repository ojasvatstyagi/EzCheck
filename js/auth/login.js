import {
  validateEmail,
  validatePassword,
  validateName,
  validateRole,
} from "../utils/validators.js";

const form = document.getElementById("loginForm");
const toggle = document.getElementById("toggleForm");
const formTitle = document.getElementById("formTitle");
const toggleText = document.getElementById("toggleText");
const registerFields = document.getElementById("registerFields");
const submitBtn = document.getElementById("submitBtn");

let isLogin = true;

toggle.addEventListener("click", () => {
  isLogin = !isLogin;
  formTitle.innerText = isLogin ? "Login" : "Register";
  submitBtn.innerText = isLogin ? "Login" : "Register";
  toggleText.innerText = isLogin
    ? "Don't have an account?"
    : "Already have an account?";
  toggle.innerText = isLogin ? "Register here" : "Login here";
  registerFields.style.display = isLogin ? "none" : "block";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!validateEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }
  if (!validatePassword(password)) {
    alert("Password must be at least 6 characters.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (isLogin) {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      alert("Invalid credentials.");
    } else if (!user.verified) {
      alert("Please verify your email before logging in.");
    } else {
      sessionStorage.setItem("token", "mock-jwt-token");
      sessionStorage.setItem("role", user.role);
      window.location.href = "dashboard.html";
    }
  } else {
    const name = document.getElementById("name").value.trim();
    const role = document.getElementById("role").value;

    if (!validateName(name)) {
      alert("Please enter your name.");
      return;
    }
    if (!validateRole(role)) {
      alert("Please select a role.");
      return;
    }

    if (users.find((u) => u.email === email)) {
      alert("Email already registered.");
      return;
    }

    users.push({
      name,
      email,
      password,
      role,
      verified: false,
    });

    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem("mockOtp", mockOtp);
    console.log("Mock OTP sent to email:", mockOtp); // simulate email send

    alert(`A verification OTP was sent to ${email}.`);
    window.location.href = "verify-otp.html";

    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! Please check your email to verify.");

    setTimeout(() => {
      const index = users.findIndex((u) => u.email === email);
      users[index].verified = true;
      localStorage.setItem("users", JSON.stringify(users));
      alert("Email verified successfully! You can now login.");
      toggle.click();
    }, 1000);
  }
});
