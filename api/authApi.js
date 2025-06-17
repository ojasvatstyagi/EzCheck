//==========================Development API Calls==========================
// This file contains ONLY development/mock logic for your API service.
// It uses localStorage and sessionStorage to simulate backend operations.

// api/authApi.js

// api/authApi.js

import VisitorService from "./visitorApi.js";
import { storeUserSession, clearUserSession } from "../js/utils/helpers.js";

export default {
  async login(phone, password) {
    // Parameter is 'phone'
    const users = JSON.parse(localStorage.getItem("vms_users") || "[]");
    // Find user by their 'phone' field
    const user = users.find(
      (u) => u.phone === phone && u.password === password
    );

    if (!user)
      return { success: false, message: "Invalid phone number or password" };
    if (!user.verified)
      return {
        success: false,
        message: "Please verify your phone number first",
      };

    sessionStorage.setItem("token", "mock-jwt-token");
    sessionStorage.setItem("role", user.role);
    storeUserSession({
      id: user.id,
      role: user.role,
      name: user.name,
      phone: user.phone, // Store the phone number consistently
      visitorId: user.visitorId || null,
    });

    return {
      success: true,
      data: {
        token: "mock-jwt-token",
        role: user.role,
        name: user.name,
        phone: user.phone, // Return the phone number
        visitorId: user.visitorId || null,
      },
    };
  },

  async register(name, phone, password, role) {
    // Parameter is 'phone'
    const users = JSON.parse(localStorage.getItem("vms_users") || "[]");

    // Check for uniqueness based on the 'phone' number
    if (users.some((u) => u.phone === phone)) {
      return { success: false, message: "Phone number already registered" };
    }

    const id = Date.now().toString();
    const newUser = { id, name, password, role, verified: false };

    let visitorProfileId = null;

    if (role === "visitor") {
      try {
        newUser.phone = phone;
        newUser.email = null; // Set email to null for new visitor registrations in vms_users

        const initialVisitorProfile = {
          name: name,
          email: null, // Set email to null for new visitor profiles
          phone: phone, // Ensuring phone property is set
          company: null,
          idNumber: null,
          idProof: null,
          photo: null,
          isBlocked: false,
          isVIP: false,
          registrationDate: new Date().toISOString(),
        };
        const visitorRegisterResult = await VisitorService.registerVisitor(
          initialVisitorProfile
        );

        if (visitorRegisterResult.success) {
          visitorProfileId = visitorRegisterResult.visitorId;
          newUser.visitorId = visitorProfileId;
        } else {
          return {
            success: false,
            message: `Failed to register visitor profile: ${visitorRegisterResult.message}`,
          };
        }
      } catch (error) {
        return {
          success: false,
          message: `An error occurred during visitor profile setup: ${error.message}`,
        };
      }
    } else {
      // For admin/guard/host roles
      newUser.phone = phone; // Store the phone number
      delete newUser.email; // Explicitly remove the email field if it was added by default
      // Or ensure it's not added in the first place based on earlier logic
    }

    users.push(newUser);
    localStorage.setItem("vms_users", JSON.stringify(users));

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem(`otp_${phone}`, otp); // Use 'phone' for OTP storage key
    console.log("Mock OTP for development:", otp);
    return { success: true, message: "OTP sent to phone number" };
  },

  async verifyOTP(phone, otp) {
    // Parameter is 'phone'
    const storedOTP = sessionStorage.getItem(`otp_${phone}`); // Use 'phone' for OTP storage key
    if (storedOTP === otp) {
      const users = JSON.parse(localStorage.getItem("vms_users"));
      const userIndex = users.findIndex(
        (u) => u.phone === phone // Find user by 'phone'
      );
      if (userIndex !== -1) {
        users[userIndex].verified = true;
        localStorage.setItem("vms_users", JSON.stringify(users));
        sessionStorage.removeItem(`otp_${phone}`);
        return {
          success: true,
          message: "Phone number verified successfully!",
        };
      }
    }
    return { success: false, message: "Invalid OTP" };
  },

  async resendOTP(phone) {
    // Parameter is 'phone'
    const users = JSON.parse(localStorage.getItem("vms_users") || "[]");
    if (!users.some((u) => u.phone === phone)) {
      // Check if the phone number is registered
      return { success: false, message: "Phone number not registered." };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem(`otp_${phone}`, otp); // Use 'phone' for OTP storage key
    console.log("New mock OTP for development:", otp);
    return { success: true, message: "New OTP sent" };
  },

  async verifySession() {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return { success: false, message: "No session found" };
    }
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
