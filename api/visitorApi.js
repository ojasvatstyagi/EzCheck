// js/api/visitorApi.js

function generateUniqueId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

class VisitorService {
  constructor() {
    // Initialize mock data from localStorage or default values
    this.mockVisitors =
      JSON.parse(localStorage.getItem("mock_visitors")) ||
      this._getDefaultVisitors();
    this.mockVisits =
      JSON.parse(localStorage.getItem("mock_visits")) ||
      this._getDefaultVisits();
    this.mockBlacklist =
      JSON.parse(localStorage.getItem("mock_blacklist")) ||
      this._getDefaultBlacklist();
    this.vmsUsers =
      JSON.parse(localStorage.getItem("vms_users")) || this._getDefaultUsers();

    this._saveAllMockData();
  }

  // --- Private Helper Methods ---
  _getDefaultVisitors() {
    return [];
  }
  _getDefaultVisits() {
    return [];
  }
  _getDefaultBlacklist() {
    return [];
  }
  _getDefaultUsers() {
    return [];
  }
  _saveAllMockData() {
    localStorage.setItem("mock_visitors", JSON.stringify(this.mockVisitors));
    localStorage.setItem("mock_visits", JSON.stringify(this.mockVisits));
    localStorage.setItem("mock_blacklist", JSON.stringify(this.mockBlacklist));
    localStorage.setItem("vms_users", JSON.stringify(this.vmsUsers));
  }

  // --- Visitor Management ---

  /**
   * Fetches the list of all registered visitors.
   * @returns {Promise<Array<Object>>} A promise that resolves with the list of visitors.
   */
  async fetchVisitors() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockVisitors);
      }, 500);
    });
  }

  /**
   * Fetches the list of visitors who are not blacklisted.
   * @returns {Promise<Array<Object>>} A promise that resolves with the filtered list of visitors.
   */
  async fetchVisitorsIfNotBlacklisted() {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredVisitors = this.mockVisitors.filter(
          (visitor) => !visitor.isBlocked
        );
        resolve(filteredVisitors);
      }, 500);
    });
  }

  /**
   * Fetches visitor data by ID.
   * @param {string} visitorId - The ID of the visitor.
   * @returns {Promise<Object>} A promise that resolves with the visitor's data.
   */
  async fetchVisitorData(visitorId) {
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        const visitor = this.mockVisitors.find((v) => v.id === visitorId);

        if (!visitor) {
          return reject(
            new Error("Visitor profile not found. Please register or login.")
          );
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
          this.mockVisits.find(
            (v) => v.visitorId === visitorId && v.status === "Checked-In"
          ) ||
          this.mockVisits.find(
            (v) => v.visitorId === visitorId && v.status === "Approved"
          ) ||
          this.mockVisits.find(
            (v) => v.visitorId === visitorId && v.status === "Pending"
          );

        const visitHistory = this.mockVisits
          .filter((v) => v.visitorId === visitorId)
          .map((visit) => ({
            date: visit.visitDate,
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
            return dateB - dateA; // Sort by most recent visit
          });

        resolve({
          id: visitor.id,
          name: visitor.name,
          company: visitor.company,
          photo: visitor.photo || null,
          phone: visitor.phone,
          idName: visitor.idName || null, // Ensure idName is pulled
          idProof: visitor.idProof || null, // Ensure idProof is pulled
          isBlocked: isBlocked,
          currentVisit: currentVisit
            ? {
                id: currentVisit.id,
                purpose: currentVisit.purpose,
                host: currentVisit.host || "N/A",
                visitDate: currentVisit.visitDate,
                status: currentVisit.status,
                entryTime: currentVisit.checkInTime || "",
                checkOutTime: currentVisit.checkOutTime || "",
              }
            : null,
          visitHistory: visitHistory,
        });
      }, 500);
    });
  }

  /**
   * Registers a new visitor or updates an existing one based on phone number.
   * @param {Object} visitorData - The visitor's data.
   * @returns {Promise<Object>} A promise that resolves with the registration result.
   */
  async requestVisit(visitorId, visitorName, visitData, isWalkIn = false) {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const visitor = this.mockVisitors.find((v) => v.id === visitorId);

        if (!visitor) {
          resolve({ success: false, message: "Visitor not found." });
          return;
        }

        const blacklist = await this.fetchBlacklist();
        if (await this.isVisitorOnBlacklist(visitor, blacklist)) {
          resolve({
            success: false,
            message: `Visitor ${visitor.name} is blacklisted. Cannot request visit.`,
          });
          return;
        }

        const newVisit = {
          id: generateUniqueId("VISIT"),
          visitorId: visitorId,
          visitorName: visitorName,
          purpose: visitData.purpose,
          host: visitData.host,
          hostId: visitData.hostId,
          visitDate: visitData.visitDate,
          startTime: visitData.startTime,
          endTime: visitData.endTime,
          duration: visitData.duration,
          notes: visitData.notes,
          status: isWalkIn ? "Checked-In" : "Pending",
          requestDate: new Date().toISOString(),
          checkInTime: isWalkIn ? new Date().toISOString() : null,
          checkOutTime: null,
          isWalkIn: isWalkIn,
        };

        this.mockVisits.push(newVisit);
        this._saveAllMockData();

        console.log(
          `Mock: Visit requested for ${visitorName}. Status: ${newVisit.status}`
        );
        resolve({
          success: true,
          message: `Visit requested successfully. Status: ${newVisit.status}`,
          visitId: newVisit.id,
          visit: newVisit,
        });
      }, 500);
    });
  }

  /**
   * Updates a visitor's profile.
   * @param {string} visitorId - The ID of the visitor to update.
   * @param {Object} updatedData - The fields to update.
   * @returns {Promise<Object>} A promise that resolves with the update result.
   */
  async updateProfile(visitorId, updatedData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const visitorIndex = this.mockVisitors.findIndex(
          (v) => v.id === visitorId
        );
        const userIndex = this.vmsUsers.findIndex(
          (u) => u.visitorId === visitorId
        ); // Assuming vmsUsers might also hold visitor data if they're also users

        if (visitorIndex === -1) {
          resolve({
            success: false,
            message: "Visitor not found for update.",
          });
          return;
        }

        this.mockVisitors[visitorIndex] = {
          ...this.mockVisitors[visitorIndex],
          ...updatedData,
        };

        if (userIndex !== -1) {
          this.vmsUsers[userIndex] = {
            ...this.vmsUsers[userIndex],
            ...updatedData,
          };
        }

        this._saveAllMockData();
        resolve({
          success: true,
          message: "Profile updated successfully (mock).",
        });
      }, 700);
    });
  }

  /**
   * Uploads an ID proof for a visitor.
   * @param {string} visitorId - The ID of the visitor.
   * @param {string} idType - The type of ID (e.g., "Aadhar Card").
   * @param {string} idFileBase64 - The Base64 string of the ID file.
   * @param {string} mimeType - The MIME type of the uploaded file.
   * @returns {Promise<Object>} A promise that resolves with the upload result.
   */
  async uploadIdProof(visitorId, idType, idFileBase64, mimeType) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const visitorIndex = this.mockVisitors.findIndex(
          (v) => v.id === visitorId
        );

        if (visitorIndex === -1) {
          resolve({ success: false, message: "Visitor not found." });
          return;
        }

        const visitor = this.mockVisitors[visitorIndex];

        visitor.idName = idType; // Storing the type (e.g., "Aadhar Card")
        visitor.idProof = {
          // Storing the document data
          data: idFileBase64,
          mimeType: mimeType,
          uploadDate: new Date().toISOString(),
        };

        this._saveAllMockData();

        console.log(
          `Mock: ID proof uploaded for visitor ${visitorId}. Type: ${idType}`
        );
        resolve({
          success: true,
          message: "ID proof uploaded successfully (mock).",
        });
      }, 1000);
    });
  }

  /**
   * Uploads a photo for a visitor.
   * @param {string} visitorId - The ID of the visitor.
   * @param {FormData} formData - FormData containing the 'photo' file.
   * @returns {Promise<Object>} A promise that resolves with the upload result.
   */
  async uploadPhoto(visitorId, formData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const visitorIndex = this.mockVisitors.findIndex(
          (v) => v.id === visitorId
        );

        if (visitorIndex === -1) {
          return resolve({ success: false, message: "Visitor not found." });
        }

        const file = formData.get("photo");
        if (!file) {
          return resolve({
            success: false,
            message: "No photo file provided.",
          });
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Photo = event.target.result;

          this.mockVisitors[visitorIndex].photo = base64Photo;
          this._saveAllMockData();

          console.log(
            `Mock: Photo uploaded and updated for visitor ${visitorId}.`
          );
          resolve({
            success: true,
            message: "Photo uploaded successfully (mock).",
            newPhotoUrl: base64Photo,
          });
        };
        reader.onerror = (error) => {
          console.error("FileReader error:", error);
          reject({
            success: false,
            message: "Error reading photo file for mock upload.",
          });
        };
        reader.readAsDataURL(file);
      }, 1000);
    });
  }

  // --- Visit Management ---

  /**
   * Requests a new visit for a visitor.
   * @param {string} visitorId - The ID of the visitor.
   * @param {string} visitorName - The name of the visitor.
   * @param {Object} visitData - Details of the visit (purpose, host, visitDate, notes).
   * @param {boolean} isWalkIn - True if it's a walk-in visit, false otherwise.
   * @returns {Promise<Object>} A promise that resolves with the visit request result.
   */
  async requestVisit(visitorId, visitorName, visitData, isWalkIn = false) {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const visitor = this.mockVisitors.find((v) => v.id === visitorId);

        if (!visitor) {
          resolve({ success: false, message: "Visitor not found." });
          return;
        }

        const blacklist = await this.fetchBlacklist();
        if (await this.isVisitorOnBlacklist(visitor, blacklist)) {
          resolve({
            success: false,
            message: `Visitor ${visitor.name} is blacklisted. Cannot request visit.`,
          });
          return;
        }

        const newVisit = {
          id: generateUniqueId("VISIT"),
          visitorId: visitorId,
          visitorName: visitorName,
          purpose: visitData.purpose,
          host: visitData.host,
          visitDate: visitData.visitDate,
          notes: visitData.notes,
          status: isWalkIn ? "Checked-In" : "Pending",
          requestDate: new Date().toISOString(),
          checkInTime: isWalkIn ? new Date().toISOString() : null,
          checkOutTime: null,
          isWalkIn: isWalkIn,
        };

        this.mockVisits.push(newVisit);
        this._saveAllMockData();

        console.log(
          `Mock: Visit requested for ${visitorName}. Status: ${newVisit.status}`
        );
        resolve({
          success: true,
          message: `Visit requested successfully. Status: ${newVisit.status}`,
          visitId: newVisit.id,
          visit: newVisit,
        });
      }, 500);
    });
  }

  /**
   * Fetches the list of all visit records.
   * @returns {Promise<Array<Object>>} A promise that resolves with the list of visit records.
   */
  async fetchAllVisits() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockVisits);
      }, 500);
    });
  }

  /**
   * Fetches today's visits.
   * @returns {Promise<Array<Object>>} A promise that resolves with the list of today's visits.
   */
  async fetchTodayVisits() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        const endOfToday = new Date(today);
        endOfToday.setDate(today.getDate() + 1); // Start of tomorrow

        const todayVisits = this.mockVisits
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
            const visitor = this.mockVisitors.find(
              (v) => v.id === visit.visitorId
            );
            return {
              ...visit,
              visitor: visitor
                ? {
                    name: visitor.name,
                    company: visitor.company,
                    phone: visitor.phone,
                    // idNumber is removed
                    idName: visitor.idName, // Include idName if needed
                  }
                : null,
            };
          });

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
  }

  /**
   * Fetches all visits for a specific host.
   * @param {string} hostName - The name of the host.
   * @returns {Promise<Object>} A promise that resolves with the host's visits.
   */
  async fetchVisitsByHost(hostName) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const hostVisits = this.mockVisits.filter(
          (visit) =>
            visit.host && visit.host.toLowerCase() === hostName.toLowerCase()
        );

        resolve({
          success: true,
          visits: hostVisits,
          message: "Host visits fetched successfully (mock).",
        });
      }, 500);
    });
  }

  /**
   * Checks-in or checks-out a visit.
   * @param {string} visitId - The ID of the visit.
   * @returns {Promise<Object>} A promise that resolves with the check-in/out result.
   */
  async checkInOutVisit(visitId) {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const visitIndex = this.mockVisits.findIndex((v) => v.id === visitId);

        if (visitIndex === -1) {
          return resolve({
            success: false,
            message: "Visit ID not found. Please verify.",
          });
        }

        const visit = this.mockVisits[visitIndex];
        const visitor = this.mockVisitors.find((v) => v.id === visit.visitorId);

        if (!visitor) {
          return resolve({
            success: false,
            message: "Associated visitor not found for this visit.",
          });
        }

        // Blacklist Check
        const blacklist = await this.fetchBlacklist();
        if (await this.isVisitorOnBlacklist(visitor, blacklist)) {
          return resolve({
            success: false,
            message: `Visitor ${visitor.name} is blacklisted. Access denied.`,
          });
        }

        let message = "";
        let newStatus = "";
        let success = false;

        if (!visit.checkInTime) {
          visit.checkInTime = new Date().toISOString();
          visit.status = "Checked-In";
          message = `Visitor ${visitor.name} checked in successfully.`;
          newStatus = "Checked-In";
          success = true;
        } else if (visit.checkInTime && !visit.checkOutTime) {
          visit.checkOutTime = new Date().toISOString();
          visit.status = "Completed";
          message = `Visitor ${visitor.name} checked out successfully.`;
          newStatus = "Completed";
          success = true;
        } else if (visit.checkOutTime) {
          message = `Visit for ${visitor.name} already completed.`;
          newStatus = "Completed";
          success = false;
        } else {
          message = "Visit status is unclear. No action taken.";
          newStatus = visit.status;
          success = false;
        }

        if (success) {
          this._saveAllMockData();
        }

        console.log(
          `Mock: Check-in/out for Visit ID ${visitId}. Status: ${newStatus}`
        );
        resolve({
          success: success,
          message: message,
          visitorName: visitor.name,
          visitStatus: newStatus,
          updatedVisit: visit,
        });
      }, 500);
    });
  }

  /**
   * Cancels a visit.
   * @param {string} visitId - The ID of the visit to cancel.
   * @returns {Promise<Object>} A promise that resolves with the cancellation result.
   */
  async cancelVisit(visitId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const visitIndex = this.mockVisits.findIndex((v) => v.id === visitId);
        if (visitIndex !== -1) {
          this.mockVisits[visitIndex].status = "Cancelled";
          if (!this.mockVisits[visitIndex].checkOutTime) {
            this.mockVisits[visitIndex].checkOutTime = new Date().toISOString();
          }
          this._saveAllMockData();
          resolve({ success: true, message: `Visit ${visitId} cancelled.` });
        } else {
          resolve({ success: false, message: `Visit ${visitId} not found.` });
        }
      }, 700);
    });
  }

  /**
   * Allow host to cancel an approved visit within a time buffer.
   * @param {string} visitId - The ID of the visit.
   * @param {string} requestingHostName - The name of the host requesting cancellation.
   * @returns {Promise<Object>} A promise that resolves with the cancellation result.
   */
  async cancelApprovedVisitByHost(visitId, requestingHostName) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const visitIndex = this.mockVisits.findIndex((v) => v.id === visitId);

        if (visitIndex === -1) {
          return resolve({ success: false, message: "Visit not found." });
        }

        const visit = this.mockVisits[visitIndex];

        // 1. Authorization Check
        if (visit.host !== requestingHostName) {
          return resolve({
            success: false,
            message: "You are not authorized to cancel this visit.",
          });
        }

        // 2. Status Check
        if (visit.status !== "Approved") {
          return resolve({
            success: false,
            message: `Visit status is '${visit.status}'. Only 'Approved' visits can be cancelled by the host.`,
          });
        }

        // 3. Time Check: Only allow cancellation before the day of the visit
        const visitDate = new Date(visit.visitDate);
        visitDate.setHours(0, 0, 0, 0);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (visitDate > currentDate) {
          visit.status = "Cancelled";
          visit.checkOutTime = new Date().toISOString();
          this._saveAllMockData();

          console.log(
            `Mock: Visit ${visitId} cancelled by host ${requestingHostName}.`
          );
          return resolve({
            success: true,
            message: "Visit cancelled successfully.",
          });
        } else {
          const message =
            visitDate.getTime() === currentDate.getTime()
              ? "Cancellation not allowed on the day of the visit."
              : "Cancellation not allowed for past or same-day visits.";
          return resolve({
            success: false,
            message,
          });
        }
      }, 500);
    });
  }

  /**
   * Updates the status of a visit.
   * @param {string} visitId - The ID of the visit.
   * @param {string} newStatus - The new status to set.
   * @returns {Promise<Object>} A promise that resolves with the update result.
   */
  async updateVisitStatus(visitId, newStatus) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const visitIndex = this.mockVisits.findIndex(
          (visit) => visit.id === visitId
        );
        if (visitIndex > -1) {
          this.mockVisits[visitIndex].status = newStatus;

          if (
            newStatus === "Declined" ||
            newStatus === "Completed" ||
            newStatus === "Cancelled"
          ) {
            if (!this.mockVisits[visitIndex].checkOutTime) {
              this.mockVisits[visitIndex].checkOutTime =
                new Date().toISOString();
            }
          }
          console.log(`Mock: Visit ${visitId} status updated to ${newStatus}`);

          this._saveAllMockData();

          resolve({ success: true, message: "Status updated successfully." });
        } else {
          reject(new Error("Visit not found."));
        }
      }, 500);
    });
  }

  // --- Blacklist Management ---

  /**
   * Fetches the list of all blacklisted visitors.
   * @returns {Promise<Array<Object>>} A promise that resolves with the list of blacklisted visitors.
   */
  async fetchBlacklist() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockBlacklist);
      }, 500);
    });
  }

  /**
   * Adds a visitor entry to the blacklist.
   * @param {Object} entry - The entry to add to the blacklist (should contain phone).
   * @returns {Promise<Object>} A promise that resolves with the blacklist addition result.
   */
  async addToBlacklist(entry) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if already in blacklist by phone
        const exists = this.mockBlacklist.some(
          (b) => b.mobile === entry.mobile // Assuming 'mobile' on blacklist entry is the phone number
        );
        if (exists) {
          return reject(
            new Error("Visitor with this phone number already in blacklist.")
          );
        }

        // Mark visitor as blocked
        const visitor = this.mockVisitors.find((v) => v.phone === entry.mobile);
        if (visitor) {
          console.log("Visitor found:", visitor);
          visitor.isBlocked = true;
        }

        // Add to blacklist
        const newEntry = {
          id: generateUniqueId("BL"),
          addedOn: new Date().toISOString(),
          ...entry, // Ensure 'mobile' is passed here
        };

        this.mockBlacklist.push(newEntry);
        this._saveAllMockData();
        resolve({
          success: true,
          message: "Added to blacklist",
          entry: newEntry,
        });
      }, 300);
    });
  }

  /**
   * Removes a visitor entry from the blacklist.
   * @param {string} id - The ID of the blacklist entry to remove.
   * @returns {Promise<Object>} A promise that resolves with the blacklist removal result.
   */
  async removeFromBlacklist(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const entryToRemove = this.mockBlacklist.find(
          (entry) => entry.id === id
        );
        if (!entryToRemove) {
          return reject(new Error("Blacklist entry not found."));
        }

        // Mark visitor as unblocked
        const visitor = this.mockVisitors.find(
          (v) => v.phone === entryToRemove.mobile
        );
        if (visitor) {
          visitor.isBlocked = false;
        }

        this.mockBlacklist = this.mockBlacklist.filter(
          (entry) => entry.id !== id
        );
        this._saveAllMockData();
        resolve({ success: true, message: "Removed from blacklist" });
      }, 300);
    });
  }

  /**
   * Checks if a visitor is on the blacklist based on phone number.
   * @param {Object} visitor - The visitor object.
   * @param {Array<Object>} blacklist - The current blacklist array.
   * @returns {Promise<boolean>} A promise that resolves to true if the visitor is blacklisted, false otherwise.
   */
  async isVisitorOnBlacklist(visitor, blacklist) {
    if (!visitor || !blacklist || blacklist.length === 0) {
      return false;
    }
    return blacklist.some((blockedEntry) => {
      const visitorPhone = visitor.phone?.replace(/\D/g, ""); // Clean visitor phone
      const blockedMobile = blockedEntry.mobile?.replace(/\D/g, ""); // Clean blocked mobile

      return visitorPhone && blockedMobile && visitorPhone === blockedMobile;
    });
  }

  // --- User/Host Management & Reporting ---

  /**
   * Fetches the list of hosts (users with role 'host').
   * @returns {Promise<Array<Object>>} A promise that resolves with the list of hosts.
   */
  async fetchHosts() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const hosts = this.vmsUsers
          .filter((user) => user.role === "host")
          .map((hostUser) => ({
            id: hostUser.id,
            name: hostUser.name,
            phone: hostUser.phone,
          }));
        console.log("Fetched hosts:", hosts);
        resolve(JSON.parse(JSON.stringify(hosts)));
      }, 200);
    });
  }

  /**
   * Exports all visits for a specific host as a JSON file.
   * @param {string} hostName - The name of the host.
   * @returns {Promise<Object>} A promise that resolves with the export result.
   */
  async exportHostVisitsToJson(hostName) {
    try {
      const response = await this.fetchVisitsByHost(hostName);
      const hostVisits = response.visits || [];

      const jsonString = JSON.stringify(hostVisits, null, 2);

      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      const date = new Date().toISOString().slice(0, 10);
      a.download = `visits_report_${hostName}_${date}.json`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return { success: true, message: "Report exported successfully." };
    } catch (error) {
      console.error("Error exporting report:", error);
      throw new Error(
        `Failed to export report: ${error.message || "Unknown error"}`
      );
    }
  }

  /**
   * Exports all admin data (visitors, visits, blacklist) to a JSON file.
   * @returns {Promise<void>} A promise that resolves when the export is complete.
   */
  async exportAdminDataToJson() {
    try {
      const [visitors, visits, blacklist] = await Promise.all([
        this.fetchVisitors(),
        this.fetchAllVisits(),
        this.fetchBlacklist(),
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        visitors: visitors,
        visits: visits,
        blacklist: blacklist,
      };

      const jsonString = JSON.stringify(exportData, null, 2);

      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `visitor_management_data_export_${new Date()
        .toISOString()
        .slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting admin data:", error);
      throw error;
    }
  }
}

export default new VisitorService();
