const loginLogo =
  "https://cdni.iconscout.com/illustration/premium/thumb/login-security-illustration-download-in-svg-png-gif-file-formats--account-password-secure-miscellaneous-pack-illustrations-5230133.png?f=webp";

const registerLogo =
  "https://cdni.iconscout.com/illustration/premium/thumb/login-security-illustration-download-in-svg-png-gif-file-formats--password-account-profile-picanto-set-02-pack-business-illustrations-6933913.png";

const otpLogo =
  "https://cdni.iconscout.com/illustration/premium/thumb/one-time-password-security-illustration-download-in-svg-png-gif-file-formats--digital-encryption-otp-smartphone-cyber-pack-science-technology-illustrations-10900332.png";

export function renderLoginForm() {
  return `
    <div class="text-center mb-4">
      <img src="${loginLogo}" alt="VMS Logo" class="auth-logo">
      <h2 class="mb-3">Welcome Back</h2>
      <p class="text-muted">Please login to continue</p>
    </div>
    
    <form id="loginForm">
      <div class="form-floating mb-3">
        <input type="email" class="form-control" id="loginEmail" placeholder="name@example.com" required>
        <label for="loginEmail">Email address</label>
      </div>
      
      <div class="form-floating mb-3">
        <input type="password" class="form-control" id="loginPassword" placeholder="Password" required>
        <label for="loginPassword">Password</label>
      </div>
      
      <button type="submit" class="btn btn-custom w-100 py-2 mb-3 btn-custom:hower">
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
        <input type="text" class="form-control" id="registerName" placeholder="Full Name" required>
        <label for="registerName">Full Name</label>
      </div>
      
      <div class="form-floating mb-3">
        <input type="email" class="form-control" id="registerEmail" placeholder="name@example.com" required>
        <label for="registerEmail">Email address</label>
      </div>
      
      <div class="form-floating mb-3">
        <input type="password" class="form-control" id="registerPassword" placeholder="Password" required>
        <label for="registerPassword">Password</label>
      </div>
      
      <div class="form-floating mb-3">
        <select class="form-select" id="registerRole" required>
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
  const maskedEmail = email.replace(
    /(.{1,3})(.*)(@.*)/,
    (_, a, b, c) => a + b.replace(/./g, "*") + c
  );

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
          <input type="text" class="otp-input form-control" id="otp-${i}" 
                 maxlength="1" pattern="[0-9]" inputmode="numeric" required>
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
    
    <script>
      // Auto-focus and move between OTP inputs
      const otpInputs = document.querySelectorAll('.otp-input');
      otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
          if (e.target.value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
          }
        });
        
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && index > 0 && !e.target.value) {
            otpInputs[index - 1].focus();
          }
        });
      });
    </script>
  `;
}
