// Mock OTP sent
const generatedOtp = sessionStorage.getItem("mockOtp");

document.getElementById("otpForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const enteredOtp = document.getElementById("otp").value.trim();

  if (enteredOtp === generatedOtp) {
    alert("Email verified successfully! Registration complete.");
    sessionStorage.removeItem("mockOtp");

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const email = sessionStorage.getItem("email");
    const user = users.find((u) => u.email === email);
    if (user) {
      user.verified = true;
      localStorage.setItem("users", JSON.stringify(users));
    }
    window.location.href = "index.html";
  } else {
    document.getElementById("message").innerText =
      "Invalid OTP. Please try again.";
  }
});
