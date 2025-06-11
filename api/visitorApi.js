// js/api/visitorApi.js

import { mockBlacklistDb } from "../js/utils/mockBlacklistDb.js";
import { mockVisitorsDb, mockVisitsDb } from "../js/utils/mockVisitorsDb.js";

// --- Development/Mock API Calls ---
// Helper to persist mock data to localStorage
function saveMockData() {
  localStorage.setItem("mock_visitors", JSON.stringify(mockVisitorsDb));
  localStorage.setItem("mock_visits", JSON.stringify(mockVisitsDb));
}
function generateUniqueId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
export default {
  // fetch list of visitors
  async fetchVisitors() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Combine static and dynamically added mock visitors
        resolve(mockVisitorsDb);
      }, 500); // Simulate network delay
    });
  },

  //Fetches the blacklist of visitors.
  async fetchBlacklist() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockBlacklistDb);
      }, 500); // Simulate network delay
    });
  },

  // Exports a report of visitor data.
  async exportHostVisitsToJson(hostName) {
    try {
      // 1. Fetch all visits for the specified host using the existing service method
      const response = await this.fetchVisitsByHost(hostName); // Reusing the fetch logic
      const hostVisits = response.visits || [];

      // 2. Convert the JavaScript array of visits to a JSON string, prettified
      const jsonString = JSON.stringify(hostVisits, null, 2); // `null, 2` for pretty printing

      // 3. Create a Blob object from the JSON string
      const blob = new Blob([jsonString], { type: "application/json" });

      // 4. Create a temporary URL for the Blob
      const url = URL.createObjectURL(blob);

      // 5. Create a temporary anchor element to trigger the download
      const a = document.createElement("a");
      a.href = url;

      // 6. Set the download file name
      const date = new Date().toISOString().slice(0, 10); // e.g., "2025-06-11"
      a.download = `visits_report_${hostName}_${date}.json`;

      // 7. Append the anchor to the body (necessary for Firefox and good practice)
      document.body.appendChild(a);

      // 8. Programmatically click the anchor to start the download
      a.click();

      // 9. Clean up: remove the anchor and revoke the URL
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return { success: true, message: "Report exported successfully." };
    } catch (error) {
      console.error("Error exporting report:", error);
      // Re-throw the error so the calling function can catch it and show an alert
      throw new Error(
        `Failed to export report: ${error.message || "Unknown error"}`
      );
    }
  },

  async fetchVisitorData(visitorId) {
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        const visitor = mockVisitorsDb.find((v) => v.id === visitorId);

        if (!visitor) {
          reject(
            new Error("Visitor profile not found. Please register or login.")
          );
          return;
        }

        let isBlocked = false;
        try {
          const blacklist = await this.fetchBlacklist();
          isBlocked = await this.isVisitorOnBlacklist(visitor, blacklist);
        } catch (error) {
          console.warn(
            "Could not check blacklist during fetchVisitorData:",
            error
          );
        }

        const currentVisit =
          mockVisitsDb.find(
            (v) => v.visitorId === visitorId && v.status === "Checked-In"
          ) ||
          mockVisitsDb.find(
            (v) => v.visitorId === visitorId && v.status === "Approved"
          ) ||
          mockVisitsDb.find(
            (v) => v.visitorId === visitorId && v.status === "Pending"
          );

        const visitHistory = mockVisitsDb
          .filter((v) => v.visitorId === visitorId)
          .map((visit) => ({
            date: visit.visitDate, // This corresponds to the "Date (Scheduled)" column
            purpose: visit.purpose,
            host: visit.host || "N/A",
            entryTime: visit.checkInTime || "",
            exitTime: visit.checkOutTime || "",
            status: visit.status,
            id: visit.id,
            requestDate: visit.requestDate,
          }))
          .sort((a, b) => {
            const dateA = new Date(a.visitDate || a.requestDate);
            const dateB = new Date(b.visitDate || b.requestDate);
            return dateB - dateA;
          }); // Sort by most recent visit

        resolve({
          id: visitor.id,
          name: visitor.name,
          company: visitor.company,
          photo: visitor.photo || null,
          email: visitor.email,
          phone: visitor.phone,
          idNumber: visitor.idNumber,
          isBlocked: isBlocked,
          currentVisit: currentVisit
            ? {
                id: currentVisit.id,
                purpose: currentVisit.purpose,
                host: currentVisit.host || "N/A",
                date: currentVisit.visitDate,
                status: currentVisit.status,
                entryTime: currentVisit.checkInTime || "",
                checkOutTime: currentVisit.checkOutTime || "",
              }
            : null,
          visitHistory: visitHistory,
        });
      }, 500);
    });
  },

  // Registers a new visitor or retrieves an existing visitor's ID.async registerVisitor(visitorData) {
  async registerVisitor(visitorData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const emailToCompare = visitorData.email
          ? visitorData.email.toLowerCase()
          : null;
        const phoneToCompare = visitorData.phone
          ? visitorData.phone.trim()
          : null;

        // Find existing visitor by email or phone
        let existingVisitor = mockVisitorsDb.find(
          (v) =>
            (v.email &&
              emailToCompare &&
              v.email.toLowerCase() === emailToCompare) ||
            (v.phone && phoneToCompare && v.phone === phoneToCompare)
        );

        if (existingVisitor) {
          console.log(
            `Mock: Existing visitor found with email/phone, ID: ${existingVisitor.id}`
          );
          // Update existing visitor's information with any new data provided
          Object.assign(existingVisitor, {
            name: visitorData.name || existingVisitor.name,
            email: visitorData.email || existingVisitor.email,
            phone: visitorData.phone || existingVisitor.phone,
            company: visitorData.company || existingVisitor.company,
            // Only update idNumber, photo, idProof if new data is explicitly passed
            idNumber: visitorData.idNumber || existingVisitor.idNumber,
            photo: visitorData.photo || existingVisitor.photo,
            idProof: visitorData.idProof || existingVisitor.idProof,
            // isBlocked and registrationDate should ideally not be updated via this path,
            // but if visitorData includes them, they'll overwrite.
          });
          saveMockData(); // Save updated data
          resolve({
            success: true,
            message: "Visitor already registered. Info updated.",
            visitorId: existingVisitor.id,
            visitor: existingVisitor, // <-- IMPORTANT: Return the full visitor object
          });
        } else {
          // Create a new visitor
          const newVisitorId = generateUniqueId("VISITOR");
          const newVisitor = {
            id: newVisitorId,
            name: visitorData.name || "Unknown Visitor",
            email: visitorData.email || null,
            phone: visitorData.phone || null,
            company: visitorData.company || null,
            idNumber: visitorData.idNumber || null,
            photo: visitorData.photo || null,
            idProof: visitorData.idProof || null,
            isBlocked: visitorData.isBlocked ?? false, // Default to false if not provided
            registrationDate: new Date().toISOString(),
          };

          mockVisitorsDb.push(newVisitor);
          saveMockData();
          console.log(
            `Mock: New visitor profile registered, ID: ${newVisitor.id}`
          );
          resolve({
            success: true,
            message: "Visitor registered successfully.",
            visitorId: newVisitor.id,
            visitor: newVisitor, // <-- IMPORTANT: Return the full new visitor object
          });
        }
      }, 500);
    });
  },

  // UPDATED: Added visitorName as a parameter
  async requestVisit(visitorId, visitorName, visitData, isWalkIn = false) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const visitor = mockVisitorsDb.find((v) => v.id === visitorId);

        if (!visitor) {
          resolve({ success: false, message: "Visitor not found." });
          return;
        }

        // Re-check blacklist using the found visitor object
        const blacklist = await this.fetchBlacklist();
        if (await this.isVisitorOnBlacklist(visitor, blacklist)) {
          resolve({
            success: false,
            message: `Visitor ${visitor.name} is blacklisted. Cannot request visit.`,
          });
          return;
        }

        const newVisit = {
          id: generateUniqueId("VISIT"), // Ensure this generates a unique ID
          visitorId: visitorId,
          visitorName: visitorName, // <-- Use the visitorName passed as a parameter
          purpose: visitData.purpose,
          host: visitData.host,
          visitDate: visitData.visitDate, // This is the requested date/time
          notes: visitData.notes,
          status: isWalkIn ? "Checked-In" : "Pending", // Conditional status based on isWalkIn
          requestDate: new Date().toISOString(),
          checkInTime: isWalkIn ? new Date().toISOString() : null, // Immediate check-in for walk-in
          checkOutTime: null,
          isWalkIn: isWalkIn,
        };

        mockVisitsDb.push(newVisit);
        saveMockData(); // Save changes to localStorage

        console.log(
          `Mock: Visit requested for ${visitorName}. Status: ${newVisit.status}`
        );
        resolve({
          success: true,
          message: `Visit requested successfully. Status: ${newVisit.status}`,
          visitId: newVisit.id, // Returning the visitId is useful
          visit: newVisit, // <-- IMPORTANT: Return the full new visit object
        });
      }, 500);
    });
  },

  // Checks if a visitor is on the blacklist.
  async isVisitorOnBlacklist(visitor, blacklist) {
    if (!visitor || !blacklist || blacklist.length === 0) {
      return false;
    }
    return blacklist.some((blockedEntry) => {
      // Normalize data for comparison (e.g., trim spaces, convert to lowercase)
      const visitorEmail = visitor.email?.toLowerCase().trim();
      const visitorIdNumber = visitor.idNumber?.toLowerCase().trim();
      const visitorMobile = visitor.mobile?.replace(/\D/g, ""); // Remove non-digits

      const blockedEmail = blockedEntry.email?.toLowerCase().trim();
      const blockedIdNumber = blockedEntry.idNumber?.toLowerCase().trim();
      const blockedMobile = blockedEntry.mobile?.replace(/\D/g, "");

      // Match by email, ID number, or mobile. Add more fields if necessary.
      return (
        (visitorEmail && blockedEmail && visitorEmail === blockedEmail) ||
        (visitorIdNumber &&
          blockedIdNumber &&
          visitorIdNumber === blockedIdNumber) ||
        (visitorMobile && blockedMobile && visitorMobile === blockedMobile)
      );
    });
  },

  // Uploads ID proof for a visitor.
  async uploadIdProof(visitorId, idType, idNumber, idFileBase64, mimeType) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const visitorIndex = mockVisitorsDb.findIndex(
          (v) => v.id === visitorId
        );

        if (visitorIndex === -1) {
          resolve({ success: false, message: "Visitor not found." });
          return;
        }

        const visitor = mockVisitorsDb[visitorIndex];

        // Store the ID proof details including Base64 data and MIME type
        visitor.idProof = {
          type: idType,
          number: idNumber,
          data: idFileBase64, // The Base64 string of the file
          mimeType: mimeType, // Store the file's MIME type
          uploadDate: new Date().toISOString(),
        };
        // Also update the idNumber directly on the visitor object for easier access
        visitor.idNumber = idNumber;

        mockVisitorsDb[visitorIndex] = visitor; // Update the record in the array
        saveMockData(); // Persist changes to localStorage

        console.log(
          `Mock: ID proof uploaded for visitor ${visitorId}. Type: ${idType}, Number: ${idNumber}`
        );
        resolve({
          success: true,
          message: "ID proof uploaded successfully (mock).",
        });
      }, 1000); // Simulate upload delay
    });
  },
  async updateProfile(visitorId, updatedData) {
    // Development/Mock Implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const visitorIndex = mockVisitorsDb.findIndex(
          (v) => v.id === visitorId
        );

        if (visitorIndex === -1) {
          resolve({
            success: false,
            message: "Visitor not found for update.",
          });
          return;
        }

        // Update only the provided fields
        mockVisitorsDb[visitorIndex] = {
          ...mockVisitorsDb[visitorIndex],
          ...updatedData, // Overwrite existing fields with updated ones
        };
        saveMockData(); // Persist changes to localStorage

        console.log(
          `Mock: Profile updated for visitor ${visitorId}.`,
          updatedData
        );
        resolve({
          success: true,
          message: "Profile updated successfully (mock).",
        });
      }, 700); // Simulate network delay
    });
  },
  // Cancels a specific visit.
  async cancelVisit(visitId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const visitIndex = mockVisitsDb.findIndex((v) => v.id === visitId);
        if (visitIndex !== -1) {
          mockVisitsDb[visitIndex].status = "Cancelled";
          saveMockData();
          resolve({ success: true, message: `Visit ${visitId} cancelled.` });
        } else {
          resolve({ success: false, message: `Visit ${visitId} not found.` });
        }
      }, 700);
    });
  },

  // Uploads a photo for a visitor.
  async uploadPhoto(visitorId, formData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const visitorIndex = mockVisitorsDb.findIndex(
          (v) => v.id === visitorId
        );

        if (visitorIndex === -1) {
          resolve({ success: false, message: "Visitor not found." });
          return;
        }

        const file = formData.get("photo"); // Get the file object from FormData
        if (!file) {
          resolve({ success: false, message: "No photo file provided." });
          return;
        }
        const reader = new FileReader();
        reader.onload = function (event) {
          const base64Photo = event.target.result; // This is the Base64 data URL

          // Update the visitor's photo in your mock DB
          mockVisitorsDb[visitorIndex].photo = base64Photo;
          saveMockData(); // Persist the change

          console.log(
            `Mock: Photo uploaded and updated for visitor ${visitorId}.`
          );
          resolve({
            success: true,
            message: "Photo uploaded successfully (mock).",
            newPhotoUrl: base64Photo, // Optionally return the new URL for immediate UI update
          });
        };
        reader.onerror = function (error) {
          console.error("FileReader error:", error);
          resolve({
            success: false,
            message: "Error reading photo file for mock upload.",
          });
        };
        reader.readAsDataURL(file); // Read the file as Base64
      }, 1000); // Simulate upload delay
    });
  },

  async checkInOutVisit(visitId) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const visitIndex = mockVisitsDb.findIndex((v) => v.id === visitId);

        if (visitIndex === -1) {
          resolve({
            success: false,
            message: "Visit ID not found. Please verify.",
          });
          return;
        }

        const visit = mockVisitsDb[visitIndex];
        const visitor = mockVisitorsDb.find((v) => v.id === visit.visitorId);

        if (!visitor) {
          resolve({ success: false, message: "Associated visitor not found." });
          return;
        }

        // --- Blacklist Check (Crucial for Guard Actions) ---
        const blacklist = await this.fetchBlacklist();
        if (await this.isVisitorOnBlacklist(visitor, blacklist)) {
          resolve({
            success: false,
            message: `Visitor ${visitor.name} is blacklisted. Access denied.`,
          });
          return;
        }

        let message = "";
        let newStatus = "";

        // Check-in logic
        if (!visit.checkInTime) {
          visit.checkInTime = new Date().toISOString();
          visit.status = "Checked-In";
          message = `Visitor ${visitor.name} checked in successfully.`;
          newStatus = "Checked-In";
        }
        // Check-out logic
        else if (visit.checkInTime && !visit.checkOutTime) {
          visit.checkOutTime = new Date().toISOString();
          visit.status = "Completed";
          message = `Visitor ${visitor.name} checked out successfully.`;
          newStatus = "Completed";
        }
        // Already checked out
        else if (visit.checkOutTime) {
          message = `Visit for ${visitor.name} already completed.`;
          newStatus = "Completed";
        } else {
          message = "Visit status is unclear. No action taken.";
          newStatus = visit.status;
        }

        saveMockData();

        console.log(
          `Mock: Check-in/out for Visit ID ${visitId}. Status: ${newStatus}`
        );
        resolve({
          success: true,
          message: message,
          visitorName: visitor.name,
          visitStatus: newStatus,
          updatedVisit: visit,
        });
      }, 500);
    });
  },
  async fetchTodayVisits() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        const endOfToday = new Date(today);
        endOfToday.setDate(today.getDate() + 1); // Start of tomorrow

        const todayVisits = mockVisitsDb
          .filter((visit) => {
            const visitDate = new Date(visit.visitDate);
            // Filter visits that are scheduled for today or have check-in/out today
            return (
              (visitDate >= today && visitDate < endOfToday) ||
              (visit.checkInTime &&
                new Date(visit.checkInTime) >= today &&
                new Date(visit.checkInTime) < endOfToday) ||
              (visit.checkOutTime &&
                new Date(visit.checkOutTime) >= today &&
                new Date(visit.checkOutTime) < endOfToday)
            );
          })
          .map((visit) => {
            // Enrich visit with visitor details
            const visitor = mockVisitorsDb.find(
              (v) => v.id === visit.visitorId
            );
            return {
              ...visit,
              visitor: visitor
                ? {
                    name: visitor.name,
                    company: visitor.company,
                    email: visitor.email,
                    phone: visitor.phone,
                    idNumber: visitor.idNumber,
                  }
                : null,
            };
          });

        // Sort by checkInTime if available, otherwise by visitDate
        todayVisits.sort((a, b) => {
          const timeA = a.checkInTime
            ? new Date(a.checkInTime)
            : new Date(a.visitDate);
          const timeB = b.checkInTime
            ? new Date(b.checkInTime)
            : new Date(b.visitDate);
          return timeA - timeB;
        });

        console.log("Mock: Fetched today's visits:", todayVisits);
        resolve(todayVisits);
      }, 500);
    });
  },

  async fetchVisitsByHost(hostName) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedVisits = localStorage.getItem("mock_visits");
        let hostVisits = [];

        if (storedVisits) {
          const visits = JSON.parse(storedVisits);
          hostVisits = visits.filter(
            (visit) =>
              visit.host && visit.host.toLowerCase() === hostName.toLowerCase()
          );
        }
        resolve({
          success: true,
          visits: hostVisits,
          message: "Host visits fetched successfully (mock).",
        });
      }, 500); // Simulate network delay
    });
  },

  async updateVisitStatus(visitId, newStatus) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const mock_visits = JSON.parse(localStorage.getItem("mock_visits"));
        const visitIndex = mock_visits.findIndex(
          (visit) => visit.id === visitId
        );
        if (visitIndex > -1) {
          // Update the status
          mock_visits[visitIndex].status = newStatus;

          if (
            newStatus === "Declined" ||
            newStatus === "Completed" ||
            newStatus === "Cancelled"
          ) {
            if (!mock_visits[visitIndex].checkOutTime) {
              mock_visits[visitIndex].checkOutTime = new Date().toISOString();
            }
          }
          console.log(`Mock: Visit ${visitId} status updated to ${newStatus}`);

          // === NEW: Save the updated mock_visits array back to localStorage ===
          localStorage.setItem("mock_visits", JSON.stringify(mock_visits));

          resolve({ success: true, message: "Status updated successfully." });
        } else {
          reject(new Error("Visit not found."));
        }
      }, 500); // Simulate API call delay
    });
  },
};
