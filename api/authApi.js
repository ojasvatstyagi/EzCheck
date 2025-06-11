//==========================Development API Calls==========================
// This file contains ONLY development/mock logic for your API service.
// It uses localStorage and sessionStorage to simulate backend operations.

// api/authApi.js

import VisitorService from "./visitorApi.js";
import { storeUserSession, clearUserSession } from "../js/utils/helpers.js";

export default {
  async login(email, password) {
    const users = JSON.parse(localStorage.getItem("vms_users") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) return { success: false, message: "Invalid credentials" };
    if (!user.verified)
      return { success: false, message: "Please verify your email first" };

    sessionStorage.setItem("token", "mock-jwt-token");
    sessionStorage.setItem("role", user.role);
    storeUserSession({
      id: user.id, // This is the user's login account ID
      role: user.role,
      name: user.name,
      visitorId: user.visitorId || null, // Use the correct visitorId from the vms_users entry
    });

    return {
      success: true,
      data: {
        token: "mock-jwt-token",
        role: user.role,
        name: user.name,
        visitorId: user.visitorId || null, // Also fix this in the return data
      },
    };
  },

  async register(name, email, password, role) {
    const users = JSON.parse(localStorage.getItem("vms_users") || "[]");

    if (users.some((u) => u.email === email)) {
      return { success: false, message: "Email already registered" };
    }

    const id = Date.now().toString();
    const newUser = { id, name, email, password, role, verified: false };

    let visitorProfileId = null; // Variable to store the ID from mock_visitors
    if (role === "visitor") {
      try {
        // Prepare initial visitor profile data
        const initialVisitorProfile = {
          name: name,
          email: email,
          // Other fields are initially null/empty; they can be filled later by the user
          phone: null,
          company: null,
          idNumber: null,
          idProof: null,
          photo: null,
          isBlocked: false, // Default status for new profiles
          registrationDate: new Date().toISOString(),
        };
        const visitorRegisterResult = await VisitorService.registerVisitor(
          initialVisitorProfile
        );

        if (visitorRegisterResult.success) {
          visitorProfileId = visitorRegisterResult.visitorId;
          console.log(
            `Auth: Visitor profile created/found for ${name} with ID: ${visitorProfileId}`
          );
          // Link the user account to the visitor profile by storing visitorProfileId in vms_users
          newUser.visitorId = visitorProfileId;
        } else {
          console.error(
            `Auth: Failed to create visitor profile for ${name}: ${visitorRegisterResult.message}`
          );
          return {
            success: false,
            message: `Failed to register visitor profile: ${visitorRegisterResult.message}`,
          };
        }
      } catch (error) {
        console.error("Auth: Error during visitor profile creation:", error);
        return {
          success: false,
          message: `An error occurred during visitor profile setup: ${error.message}`,
        };
      }
    }

    users.push(newUser);
    localStorage.setItem("vms_users", JSON.stringify(users));

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem(`otp_${email}`, otp);
    console.log("Mock OTP for development:", otp);
    return { success: true, message: "OTP sent to email" };
  },

  async verifyOTP(email, otp) {
    const storedOTP = sessionStorage.getItem(`otp_${email}`);
    if (storedOTP === otp) {
      const users = JSON.parse(localStorage.getItem("vms_users"));
      const userIndex = users.findIndex((u) => u.email === email);
      if (userIndex !== -1) {
        users[userIndex].verified = true;
        localStorage.setItem("vms_users", JSON.stringify(users));
        // Clear the OTP from session storage after successful verification
        sessionStorage.removeItem(`otp_${email}`);
        return { success: true, message: "Email verified successfully!" };
      }
    }
    return { success: false, message: "Invalid OTP" };
  },

  async resendOTP(email) {
    // Optionally, check if the user exists before sending OTP
    const users = JSON.parse(localStorage.getItem("vms_users") || "[]");
    if (!users.some((u) => u.email === email)) {
      return { success: false, message: "Email not registered." };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem(`otp_${email}`, otp);
    console.log("New mock OTP for development:", otp); // Display new OTP in console for testing
    return { success: true, message: "New OTP sent" };
  },

  async verifySession() {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return { success: false, message: "No session found" };
    }
    // In a development environment, a stored token is considered valid
    // For more robust mocking, you might also want to check the user role from sessionStorage
    // if (!sessionStorage.getItem("role") || !sessionStorage.getItem("user")) {
    //     return { success: false, message: "Incomplete session data" };
    // }
    return { success: true, message: "Session is valid (mocked)" };
  },

  async logout() {
    clearUserSession();
  },
};

//===============Production API Calls=================
/*
const API_BASE_URL = "https://api.yourvms.com/v1";

export default {
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Validate HTTP status code
      if (!response.ok) {
        // Attempt to parse error message from response body if available
        const errorData = await response.json().catch(() => ({ message: "An unexpected error occurred." }));
        return { success: false, message: errorData.message || "Invalid login attempt" };
      }

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
      return { success: false, message: "Network error. Please check your internet connection." };
    }
  },

  async register(name, email, password, role) {
    try {
      // It's highly recommended to add client-side validation here
      // E.g., password length validation (password.length >= 6)
      // E.g., basic email format validation
      // And potentially name sanitization before sending to the API.
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      // Validate HTTP status code for registration as well
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Registration failed." }));
        return { success: false, message: errorData.message || "Registration failed. Please try again." };
      }

      return await response.json();
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: "Network error. Please try again." };
    }
  },

  async verifyOTP(email, otp) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      // Validate HTTP status code for OTP verification
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "OTP verification failed." }));
        return { success: false, message: errorData.message || "OTP verification failed. Please try again." };
      }

      return await response.json();
    } catch (error) {
      console.error("OTP verification error:", error);
      return { success: false, message: "Network error. Please try again." };
    }
  },

  async resendOTP(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // Validate HTTP status code for resend OTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to resend OTP." }));
        return { success: false, message: errorData.message || "Failed to resend OTP. Please try again." };
      }

      return await response.json();
    } catch (error) {
      console.error("Resend OTP error:", error);
      return { success: false, message: "Network error. Please try again." };
    }
  },

  async verifySession() {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        return { success: false, message: "No session found" };
      }

      // In a real application, you'd send this token to your backend
      // for validation to ensure the session is still active and valid.
      const response = await fetch(`${API_BASE_URL}/auth/verify-session`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!response.ok) {
        sessionStorage.clear(); // Clear invalid session
        // Attempt to parse error message from response body
        const errorData = await response.json().catch(() => ({ message: "Session invalid or expired." }));
        return { success: false, message: errorData.message || "Session invalid or expired" };
      }
      const result = await response.json();
      return result;

    } catch (error) {
      console.error("Verify session error:", error);
      return { success: false, message: "Network error during session verification" };
    }
  },
};
*/
