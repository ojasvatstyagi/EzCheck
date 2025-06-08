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
  async exportReport() {
    // Simulate API delay for export
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(
          "Mock: Export report initiated. (No file generated in dev)"
        );
        resolve({
          success: true,
          message: "Report export initiated successfully.",
        });
      }, 1500);
    });
  },

  //Fetches detailed data for a specific visitor.
  async fetchVisitorData(visitorId) {
    // Added 'async' keyword here
    return new Promise(async (resolve, reject) => {
      // Made the Promise callback 'async' as well
      setTimeout(async () => {
        // Keep setTimeout for mock delay, also made async
        const visitor = mockVisitorsDb.find((v) => v.id === visitorId);

        if (!visitor) {
          // If a specific visitor isn't found, reject to indicate an error
          // or return a more generic "not found" state. For robust error handling, reject.
          reject(
            new Error("Visitor profile not found. Please register or login.")
          );
          return;
        }

        let isBlocked = false;
        try {
          // Assuming `this.fetchBlacklist` points to your mock or production blacklist fetcher
          const blacklist = await this.fetchBlacklist();
          isBlocked = await this.isVisitorOnBlacklist(visitor, blacklist);
        } catch (error) {
          console.warn(
            "Could not check blacklist during fetchVisitorData:",
            error
          );
        }

        // Find the current active visit, prioritizing Checked-In, then Approved, then Pending
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

        // Filter history for this visitor and sort by most recent creation date
        const visitHistory = mockVisitsDb
          .filter((v) => v.visitorId === visitorId)
          .map((visit) => ({
            // Ensure 'date' is consistent with your formatDateTime if it expects full ISO string
            date: visit.createdAt, // Keep full ISO string for more accurate date/time formatting
            purpose: visit.purpose,
            host: visit.host || "N/A", // Ensure hostName exists or provide fallback
            entryTime: visit.entryTime || "", // Use existing checkInTime field
            exitTime: visit.exitTime || "", // Use existing checkOutTime field
            status: visit.status,
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by most recent visit

        resolve({
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
                host: currentVisit.host || "N/A", // Ensure hostName is included in mockVisitsDb
                date: currentVisit.createdAt, // Use full ISO string for consistency
                status: currentVisit.status,
                entryTime: currentVisit.entryTime || "", // Include for gate pass display
                exitTime: currentVisit.exitTime || "", // Include for gate pass display
                // Add other details if available in mockVisitsDb that are useful for current pass
              }
            : null,
          visitHistory: visitHistory,
        });
      }, 500); // Simulate network delay
    });
  },

  // Registers a new visitor or retrieves an existing visitor's ID.
  async registerVisitor(visitorData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const emailToCompare = visitorData.email
          ? visitorData.email.toLowerCase()
          : null;
        const phoneToCompare = visitorData.phone
          ? visitorData.phone.trim()
          : null;

        // Corrected: Remove idNumber from lookup if it's not provided by guard form
        // Also, use normalized phone for comparison.
        const existingVisitor = mockVisitorsDb.find(
          (v) =>
            (v.email &&
              emailToCompare &&
              v.email.toLowerCase() === emailToCompare) ||
            (v.phone && phoneToCompare && v.phone === phoneToCompare)
          // If you still want to check for idNumber (e.g., if it's uploaded later),
          // ensure visitorData.idNumber is actually populated from somewhere.
          // (v.idNumber && visitorData.idNumber && v.idNumber === visitorData.idNumber)
        );

        if (existingVisitor) {
          console.log(
            `Mock: Existing visitor found with email/phone, ID: ${existingVisitor.id}`
          );
          resolve({
            success: true,
            message: "Visitor already registered.",
            visitorId: existingVisitor.id,
          });
        } else {
          // Create a new visitor
          const newVisitorId = generateUniqueId("VISITOR"); // Use "VISITOR" for clarity, or "VIS" is fine if consistent
          const newVisitor = {
            id: newVisitorId,
            name: visitorData.name || "Unknown Visitor", // Default if name is somehow missing
            email: visitorData.email || null,
            phone: visitorData.phone || null,
            company: visitorData.company || null,
            idNumber: visitorData.idNumber || null, // Keep if you might add it later, otherwise remove
            photo: visitorData.photo || null,
            idProof: visitorData.idProof || null,
            isBlocked: visitorData.isBlocked ?? false,
            registrationDate:
              visitorData.registrationDate || new Date().toISOString(),
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
          });
        }
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

  // Requests a visit for a specific visitor.
  async requestVisit(visitorId, visitData, isWalkIn = false) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const visitor = mockVisitorsDb.find((v) => v.id === visitorId);

        if (!visitor) {
          resolve({ success: false, message: "Visitor not found." });
          return;
        }

        // Re-check blacklist just in case, although addVisitor.js does this first
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
          visitorName: visitor.name, // <<-- ADDED: Crucial for displaying visitor name in visits
          purpose: visitData.purpose,
          host: visitData.host,
          visitDate: visitData.visitDate, // This is the requested date/time
          notes: visitData.notes,
          status: isWalkIn ? "Checked-In" : "Pending", // Conditional status based on isWalkIn
          requestDate: new Date().toISOString(),
          checkInTime: isWalkIn ? new Date().toISOString() : null, // Immediate check-in for walk-in
          checkOutTime: null,
          isWalkIn: isWalkIn, // <<-- ADDED: Crucial for guard dashboard filtering
        };

        mockVisitsDb.push(newVisit);
        saveMockData(); // Save changes to localStorage

        console.log(
          `Mock: Visit requested for ${visitor.name}. Status: ${newVisit.status}`
        );
        resolve({
          success: true,
          message: `Visit requested successfully. Status: ${newVisit.status}`,
          visitId: newVisit.id, // Returning the visitId is useful
        });
      }, 500);
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
};
