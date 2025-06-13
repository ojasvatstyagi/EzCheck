// forms.js

const loginLogo =
  "https://cdni.iconscout.com/illustration/premium/thumb/login-security-illustration-download-in-svg-png-gif-file-formats--account-password-secure-miscellaneous-pack-illustrations-5230133.png?f=webp";

const registerLogo =
  "https://cdni.iconscout.com/illustration/premium/thumb/login-security-illustration-download-in-svg-png-gif-file-formats--password-account-profile-picanto-set-02-pack-business-illustrations-6933913.png";

const otpLogo =
  "https://cdni.iconscout.com/illustration/premium/thumb/one-time-password-security-illustration-download-in-svg-png-gif-file-formats--digital-encryption-otp-smartphone-cyber-pack-science-technology-illustrations-10900332.png";

function getPasswordToggleIcon(fieldId) {
  return `<span class="password-toggle" onclick="togglePasswordVisibility('${fieldId}', this)" style="cursor:pointer;position:absolute;right:16px;top:50%;transform:translateY(-50%);">
    <i class="far fa-eye"></i>
  </span>`;
}

export function renderLoginForm() {
  return `
    <div class="text-center mb-4">
      <img src="${loginLogo}" alt="VMS Logo" class="auth-logo">
      <h2 class="mb-3">Welcome to EzCheck</h2>
      <p class="text-muted">Please login to continue</p>
    </div>
    <form id="loginForm">
      <div class="form-floating mb-3">
        <input type="email" class="form-control" id="loginEmail" placeholder="name@example.com" required autocomplete="email" aria-label="Email address">
        <label for="loginEmail">Email address</label>
      </div>
      <div class="form-floating mb-3 position-relative">
        <input type="password" class="form-control" id="loginPassword" placeholder="Password" required minlength="6" autocomplete="current-password" aria-label="Password">
        <label for="loginPassword">Password</label>
        ${getPasswordToggleIcon("loginPassword")}
      </div>
      <button type="submit" class="btn btn-custom w-100 py-2 mb-3">
        <i class="fas fa-sign-in-alt me-2"></i> Login
      </button>
      <div class="text-center mt-3">
        <span class="text-muted">Don't have an account? </span>
        <span id="toggleToRegister" class="auth-toggle">Register here</span>
      </div>
    </form>
  `;
}

export function renderRegisterForm() {
  return `
    <div class="text-center mb-4">
      <img src="${registerLogo}" alt="VMS Logo" class="auth-logo">
      <h2 class="mb-3">Create Account</h2>
      <p class="text-muted">Register as a new user</p>
    </div>
    <form id="registerForm">
      <div class="form-floating mb-3">
        <input type="text" class="form-control" id="registerName" placeholder="Full Name" required autocomplete="name" aria-label="Full Name">
        <label for="registerName">Full Name</label>
      </div>
      <div class="form-floating mb-3">
        <input type="email" class="form-control" id="registerEmail" placeholder="name@example.com" required autocomplete="email" aria-label="Email address">
        <label for="registerEmail">Email address</label>
      </div>
      <div class="form-floating mb-3 position-relative">
        <input type="password" class="form-control" id="registerPassword" placeholder="Password" required minlength="6" autocomplete="new-password" aria-label="Password">
        <label for="registerPassword">Password</label>
        ${getPasswordToggleIcon("registerPassword")}
      </div>
      <div class="form-floating mb-3 position-relative">
        <input type="password" class="form-control" id="registerRePassword" placeholder="Reconfirm Password" required minlength="6" autocomplete="new-password" aria-label="Reconfirm Password">
        <label for="registerRePassword">Reconfirm Password</label>
        ${getPasswordToggleIcon("registerRePassword")}
      </div>
      <div class="form-floating mb-3">
        <select class="form-select" id="registerRole" required aria-label="Select Role">
          <option value="">Select Role</option>
          <option value="visitor">Visitor</option>
          <option value="host">Host</option>
        </select>
        <label for="registerRole">Role</label>
      </div>
      <button type="submit" class="btn btn-custom w-100 py-2 mb-3">
        <i class="fas fa-user-plus me-2"></i> Register
      </button>
      <div class="text-center mt-3">
        <span class="text-muted">Already have an account? </span>
        <span id="toggleToLogin" class="auth-toggle">Login here</span>
      </div>
    </form>
  `;
}

export function renderOTPForm(email) {
  const [name, domain] = email.split("@");
  const maskedEmail =
    name.slice(0, 2) + "*".repeat(Math.max(name.length - 2, 0)) + "@" + domain;

  return `
        <div class="text-center mb-4">
            <img src="${otpLogo}" alt="Verify Email" class="auth-logo">
            <h2 class="mb-3">Verify Email</h2>
            <p class="text-muted">We sent a 6-digit code to ${maskedEmail}</p>
        </div>

        <form id="verifyOTPForm">
            <div class="otp-container mb-4">
                ${Array.from(
                  { length: 6 },
                  (_, i) => `
                    <input type="text" class="otp-input form-control text-center" id="otp-${i}"
                           maxlength="1" pattern="[0-9]" inputmode="numeric" required
                           autocomplete="off" aria-label="OTP digit ${i + 1}">
                `
                ).join("")}
            </div>

            <button type="submit" class="btn btn-custom w-100 py-2 mb-3">
                <i class="fas fa-check-circle me-2"></i> Verify
            </button>

            <div class="text-center mt-3">
                <span class="text-muted">Didn't receive code? </span>
                <span id="resendOTP" class="auth-toggle">Resend OTP</span>
            </div>
        </form>
    `;
}

window.togglePasswordVisibility = function (fieldId, iconSpan) {
  const input = document.getElementById(fieldId);
  if (input.type === "password") {
    input.type = "text";
    iconSpan.innerHTML = '<i class="far fa-eye-slash"></i>';
  } else {
    input.type = "password";
    iconSpan.innerHTML = '<i class="far fa-eye"></i>';
  }
};
