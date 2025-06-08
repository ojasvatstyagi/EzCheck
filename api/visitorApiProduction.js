//==========================Production API Calls==========================
// This block contains the actual API calls to your backend.

// Define the base URL for your production API endpoints
const API_BASE_URL = "https://api.yourvms.com/v1";
export default {
  async fetchVisitors() {
    try {
      const response = await fetch(`${API_BASE_URL}/visitors`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to fetch visitors." }));
        throw new Error(errorData.message || "Network response was not ok.");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching visitors:", error);
      // Re-throw to be caught by calling function for UI alert
      throw new Error("Could not fetch visitors. Please try again.");
    }
  },

  async fetchBlacklist() {
    try {
      const response = await fetch(`${API_BASE_URL}/blacklist/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch blacklist.");
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Production: Error fetching blacklist:", error);
      throw new Error("Could not retrieve blacklist. Please try again.");
    }
  },

  async exportReport() {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/export`, {
        method: "GET",
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to export report." }));
        throw new Error(errorData.message || "Network response was not ok.");
      }
      // Assuming API returns a file (e.g., CSV, PDF) directly
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Try to get filename from Content-Disposition header, fallback to generic
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "visitors_report.csv"; // Default filename
      if (
        contentDisposition &&
        contentDisposition.indexOf("attachment") !== -1
      ) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Clean up
      return { success: true, message: "Report downloaded successfully." };
    } catch (error) {
      console.error("Error exporting report:", error);
      throw new Error("Could not export report. Please try again.");
    }
  },

  async fetchVisitorData(visitorId) {
    try {
      const response = await fetch(`${API_BASE_URL}/visitors/${visitorId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to fetch visitor data." }));
        throw new Error(errorData.message || "Network response was not ok.");
      }

      const result = await response.json(); // Assuming this contains { id, name, ..., visits: [...] } or similar
      const visitor = result; // Adjust if your backend returns { success: true, data: visitor_object }

      let isBlocked = false;
      try {
        const blacklist = await this.fetchBlacklist(); // Call the production fetchBlacklist
        isBlocked = isVisitorOnBlacklist(visitor, blacklist);
      } catch (error) {
        console.warn(
          "Production: Could not check blacklist during fetchVisitorData:",
          error
        );
      }
      const allVisits = visitor.visits || []; // Ensure 'visits' array exists, default to empty

      // Find the current active visit, prioritizing Checked-In, then Approved, then Pending
      const currentVisit =
        allVisits.find((v) => v.status === "Checked-In") ||
        allVisits.find((v) => v.status === "Approved") ||
        allVisits.find((v) => v.status === "Pending");

      // Map and sort visit history
      const visitHistory = allVisits
        .map((visit) => ({
          date: visit.createdAt, // Assume backend returns ISO string for createdAt
          purpose: visit.purpose,
          host: visit.host || "N/A", // Assume hostName is part of the visit object
          entryTime: visit.entryTime || "",
          exitTime: visit.exitTime || "",
          status: visit.status,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by most recent

      // --- 3. Return the consolidated visitor data ---
      return {
        id: visitor.id,
        name: visitor.name,
        company: visitor.company,
        photo: visitor.photo || null,
        email: visitor.email,
        phone: visitor.phone,
        idNumber: visitor.idNumber,
        isBlocked: isBlocked, // <-- ADDED THIS IMPORTANT FLAG
        currentVisit: currentVisit
          ? {
              id: currentVisit.id,
              purpose: currentVisit.purpose,
              host: currentVisit.host || "N/A",
              date: currentVisit.createdAt,
              status: currentVisit.status,
              entryTime: currentVisit.entryTime || "",
              exitTime: currentVisit.exitTime || "",
              // Add other relevant fields from currentVisit if needed by frontend
            }
          : null,
        visitHistory: visitHistory,
        // Include any other top-level visitor data you expect from your API
      };
    } catch (error) {
      console.error(`Error fetching visitor data for ${visitorId}:`, error);
      throw new Error("Could not fetch visitor details. Please try again.");
    }
  },

  async registerVisitor(visitorData) {
    try {
      const response = await fetch(`${API_BASE_URL}/visitors/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(visitorData),
      });
      const result = await response.json(); // Always parse JSON to get success/message
      if (!response.ok) {
        throw new Error(result.message || "Network response was not ok.");
      }
      return result; // Assuming API returns { success: true, visitorId: "...", message: "..." }
    } catch (error) {
      console.error("Error registering visitor:", error);
      throw new Error(
        error.message || "Could not register visitor. Please try again."
      );
    }
  },

  async requestVisit(visitorId, visitData) {
    try {
      const response = await fetch(`${API_BASE_URL}/visits/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({ visitorId, ...visitData }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Network response was not ok.");
      }
      return result; // Assuming API returns { success: true, data: newVisit, message: "..." }
    } catch (error) {
      console.error("Error requesting visit:", error);
      throw new Error(
        error.message || "Could not request visit. Please try again."
      );
    }
  },

  async uploadIdProof(visitorId, formData) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/visitors/${visitorId}/upload-id-proof`,
        {
          method: "POST",
          headers: {
            // 'Content-Type': 'multipart/form-data' is typically set automatically by fetch when using FormData
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: formData, // FormData is sent directly
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Network response was not ok.");
      }
      return result; // Assuming API returns { success: true, message: "..." }
    } catch (error) {
      console.error("Error uploading ID proof:", error);
      throw new Error(
        error.message || "Could not upload ID proof. Please try again."
      );
    }
  },

  async updateProfile(visitorId, updatedData) {
    try {
      const response = await fetch(`${API_BASE_URL}/visitors/${visitorId}`, {
        method: "PUT", // Or PATCH, depending on your API design
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to update profile." }));
        throw new Error(errorData.message || "Network response was not ok.");
      }

      const result = await response.json();
      return {
        success: true,
        message: result.message || "Profile updated successfully.",
      }; // Assuming your API returns a success message
    } catch (error) {
      console.error(`Error updating profile for ${visitorId}:`, error);
      throw new Error("Could not update profile details. Please try again.");
    }
  },

  async cancelVisit(visitId) {
    try {
      const response = await fetch(`${API_BASE_URL}/visits/${visitId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({}), // optional: cancellationReason
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Network response was not ok.");
      }
      return result; // Assuming API returns { success: true, message: "..." }
    } catch (error) {
      console.error(`Error cancelling visit ${visitId}:`, error);
      throw new Error(
        error.message || "Could not cancel visit. Please try again."
      );
    }
  },

  async uploadPhoto(visitorId, formData) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/visitors/${visitorId}/upload-photo`,
        {
          method: "POST",
          headers: {
            // 'Content-Type': 'multipart/form-data' is typically set automatically by fetch when using FormData
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: formData, // FormData is sent directly
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Network response was not ok.");
      }
      return result; // Assuming API returns { success: true, message: "..." }
    } catch (error) {
      console.error("Error uploading photo:", error);
      throw new Error(
        error.message || "Could not upload photo. Please try again."
      );
    }
  },
  async checkInOutVisit(visitId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/guard/visits/${visitId}/check-in-out`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("guardToken")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to process visit." }));
        throw new Error(errorData.message || "Network response was not ok.");
      }

      const result = await response.json();
      return {
        success: true,
        message: result.message || "Visit processed successfully.",
        visitorName: result.visitorName, // Assuming API returns this
        visitStatus: result.visitStatus, // Assuming API returns this
      };
    } catch (error) {
      console.error(`Error processing visit ${visitId}:`, error);
      throw new Error("Could not process visit. Please try again.");
    }
  },
};
