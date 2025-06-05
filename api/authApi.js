const API_BASE_URL = "https://api.yourvms.com/v1"; // Will be replaced with actual API

export default {
  async login(email, password) {
    // Mock implementation - replace with actual API call
    if (true || process.env.NODE_ENV === "development") {
      const users = JSON.parse(localStorage.getItem("vms_users") || "[]");
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) return { success: false, message: "Invalid credentials" };
      if (!user.verified)
        return { success: false, message: "Please verify your email first" };

      // Save session data in sessionStorage for verifySession to work
      sessionStorage.setItem("token", "mock-jwt-token");
      sessionStorage.setItem("role", user.role);
      sessionStorage.setItem("user", JSON.stringify({ name: user.name }));

      return {
        success: true,
        data: {
          token: "mock-jwt-token",
          role: user.role,
          name: user.name,
        },
      };
    }

    // Production API call
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (result.success) {
        // Save session data in sessionStorage
        sessionStorage.setItem("token", result.data.token);
        sessionStorage.setItem("role", result.data.role);
        sessionStorage.setItem(
          "user",
          JSON.stringify({ name: result.data.name })
        );
      }

      return result;
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Network error" };
    }
  },

  async register(name, email, password, role) {
    // Mock implementation
    if (true || process.env.NODE_ENV === "development") {
      const users = JSON.parse(localStorage.getItem("vms_users") || "[]");

      if (users.some((u) => u.email === email)) {
        return { success: false, message: "Email already registered" };
      }

      users.push({ name, email, password, role, verified: false });
      localStorage.setItem("vms_users", JSON.stringify(users));

      // Simulate OTP generation
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem(`otp_${email}`, otp);
      console.log("Mock OTP:", otp); // For development testing

      return { success: true, message: "OTP sent to email" };
    }

    // Production API call
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      return await response.json();
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: "Network error" };
    }
  },

  async verifyOTP(email, otp) {
    // Mock implementation
    if (true || process.env.NODE_ENV === "development") {
      const storedOTP = sessionStorage.getItem(`otp_${email}`);
      if (storedOTP === otp) {
        const users = JSON.parse(localStorage.getItem("vms_users"));
        const userIndex = users.findIndex((u) => u.email === email);
        if (userIndex !== -1) {
          users[userIndex].verified = true;
          localStorage.setItem("vms_users", JSON.stringify(users));
          return { success: true };
        }
      }
      return { success: false, message: "Invalid OTP" };
    }

    // Production API call
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      return await response.json();
    } catch (error) {
      console.error("OTP verification error:", error);
      return { success: false, message: "Network error" };
    }
  },

  async resendOTP(email) {
    // Mock implementation
    if (process.env.NODE_ENV === "development") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem(`otp_${email}`, otp);
      console.log("New mock OTP:", otp);
      return { success: true, message: "New OTP sent" };
    }

    // Production API call
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      return await response.json();
    } catch (error) {
      console.error("Resend OTP error:", error);
      return { success: false, message: "Network error" };
    }
  },
};
