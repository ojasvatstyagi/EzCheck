// js/api/visitorApi.js

function generateUniqueId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

class VisitorService {
  constructor() {
    this.mockVisitors =
      JSON.parse(localStorage.getItem("mock_visitors")) ||
      this._getDefaultVisitors();
    this.mockVisits =
      JSON.parse(localStorage.getItem("mock_visits")) ||
      this._getDefaultVisits();
    this.mockBlacklist =
      JSON.parse(localStorage.getItem("mock_blacklist")) ||
      this._getDefaultBlacklist();

    this._saveAllMockData();
  }

  _getDefaultVisitors() {
    // return [
    //   {
    //     id: "VISITOR-1749411258700-uh7a6z6yl",
    //     name: "John Doe",
    //     email: "john@example.com",
    //     company: "ABC Corp",
    //     phone: "123-456-7890",
    //     idNumber: "DL12345",
    //     photo: null,
    //     isVIP: false,
    //     registrationDate: "2025-06-01T10:00:00Z",
    //   },
    //   {
    //     id: "VISITOR-123",
    //     name: "Alice Wonderland",
    //     email: "alice@example.com",
    //     company: "Wonderland Inc",
    //     phone: "987-654-3210",
    //     idNumber: "PS54321",
    //     photo: null,
    //     isVIP: true,
    //     registrationDate: "2025-05-20T11:00:00Z",
    //   },
    //   {
    //     id: "VISITOR-003",
    //     name: "Bob Johnson",
    //     email: "bob@example.com",
    //     company: "BuildIt",
    //     phone: "555-123-4567",
    //     idNumber: "DRV9876",
    //     photo: null,
    //     isVIP: false,
    //     registrationDate: "2025-06-05T09:00:00Z",
    //   },
    // ];
    return [];
  }

  _getDefaultVisits() {
    // return [
    //   {
    //     id: "VISIT-mock1",
    //     visitorId: "VISITOR-003",
    //     purpose: "Meeting",
    //     host: "Jane Doe",
    //     visitDate: "2025-06-09T10:00:00.000Z",
    //     notes: "Discussion on project Alpha",
    //     status: "Checked-In",
    //     requestDate: "2025-06-08T03:30:00.000Z",
    //     checkInTime: "2025-06-08T18:40:58.965Z",
    //     checkOutTime: null,
    //   },
    //   {
    //     id: "VISIT-mock2",
    //     visitorId: "VISITOR-1749411258700-uh7a6z6yl",
    //     purpose: "Interview",
    //     host: "host1",
    //     visitDate: "2025-06-07T14:30:00.000Z",
    //     notes: "Follow-up interview",
    //     status: "Completed",
    //     requestDate: "2025-06-06T04:30:00.000Z",
    //     checkInTime: "2025-06-07T08:55:00.000Z",
    //     checkOutTime: "2025-06-07T10:00:00.000Z",
    //   },
    //   {
    //     id: "VISIT-1749403210010-3gloeqc9z",
    //     visitorId: "VISITOR-1749411258700-uh7a6z6yl",
    //     purpose: "Delivery",
    //     host: "Rampal",
    //     notes: "test ",
    //     status: "Completed",
    //     requestDate: "2025-06-08T17:20:10.010Z",
    //     visitDate: "2025-06-08T17:20:00.000Z",
    //     checkInTime: "2025-06-08T17:30:00.635Z",
    //     checkOutTime: "2025-06-08T17:30:35.056Z",
    //   },
    //   {
    //     id: "VISIT-1749405116110-jafkqa7gj",
    //     visitorId: "VISITOR-1749411258700-uh7a6z6yl",
    //     purpose: "Interview",
    //     host: "host1",
    //     visitDate: "2025-06-08T23:21:00.000Z",
    //     notes: "test adding visitor from guard",
    //     status: "Declined",
    //     requestDate: "2025-06-08T17:51:56.110Z",
    //     checkInTime: "2025-06-08T23:25:00.000Z",
    //     checkOutTime: "2025-06-11T05:51:44.955Z",
    //   },
    //   {
    //     id: "VISIT-1749405874353-puqsizrie",
    //     visitorId: "VISITOR-1749411258700-uh7a6z6yl",
    //     purpose: "Delivery",
    //     host: "Mukesh",
    //     visitDate: "2025-06-08T23:34:00.000Z",
    //     notes: "test",
    //     status: "Completed",
    //     requestDate: "2025-06-08T18:04:34.353Z",
    //     checkInTime: "2025-06-08T18:04:34.353Z",
    //     checkOutTime: "2025-06-08T18:05:34.255Z",
    //   },
    //   {
    //     id: "VISIT-1749407879678-w01iqjg13",
    //     visitorId: "VISITOR-1749411258700-uh7a6z6yl",
    //     visitorName: "test guard user",
    //     purpose: "Delivery",
    //     host: "host1",
    //     visitDate: "2025-06-09T00:05:00.000Z",
    //     notes: "testing",
    //     status: "Pending",
    //     requestDate: "2025-06-11T18:37:59.678Z",
    //     checkInTime: "2025-06-09T00:10:00.000Z",
    //     checkOutTime: null,
    //     isWalkIn: true,
    //   },
    //   {
    //     id: "VISIT-today-host1-1",
    //     visitorId: "VISITOR-123",
    //     visitorName: "Alice Wonderland",
    //     purpose: "Consultation",
    //     host: "host1",
    //     visitDate: "2025-06-11T11:00:00.000Z",
    //     notes: "Discuss Q3 projections",
    //     status: "Approved",
    //     requestDate: "2025-06-10T09:00:00.000Z",
    //     checkInTime: "2025-06-11T11:05:00.000Z",
    //     checkOutTime: null,
    //   },
    //   {
    //     id: "VISIT-today-jane-1",
    //     visitorId: "VISITOR-003",
    //     visitorName: "Bob Johnson",
    //     purpose: "Maintenance",
    //     host: "Jane Doe",
    //     visitDate: "2025-06-11T14:30:00.000Z",
    //     notes: "Fixing AC unit",
    //     status: "Checked-In",
    //     requestDate: "2025-06-11T08:00:00.000Z",
    //     checkInTime: "2025-06-11T09:00:00.000Z",
    //     checkOutTime: null,
    //   },
    //   {
    //     id: "VISIT-today-mukesh-1",
    //     visitorId: "VISITOR-1749411258700-uh7a6z6yl",
    //     visitorName: "John Doe",
    //     purpose: "Performance Review",
    //     host: "Mukesh",
    //     visitDate: "2025-06-11T16:00:00.000Z",
    //     notes: "Annual review",
    //     status: "Approved",
    //     requestDate: "2025-06-10T10:00:00.000Z",
    //     checkInTime: "2025-06-11T16:05:00.000Z",
    //     checkOutTime: "2025-06-11T17:00:00.000Z",
    //   },
    //   {
    //     id: "VISIT-1749619810756-7o6pkz6u0",
    //     visitorId: "VISITOR-003",
    //     visitorName: "Ojas",
    //     purpose: "Meeting",
    //     host: "Host1",
    //     visitDate: "2025-06-11T10:59:00.000Z",
    //     notes: "testing host visit add",
    //     status: "Approved",
    //     requestDate: "2025-06-11T05:30:10.756Z",
    //     checkInTime: "2025-06-11T11:00:00.000Z",
    //     checkOutTime: null,
    //     isWalkIn: false,
    //   },
    // ];
    return [];
  }

  _getDefaultBlacklist() {
    // return [
    //   {
    //     id: "BL-12345",
    //     name: "Bad Visitor One",
    //     idNumber: "ID001",
    //     mobile: "1112223333",
    //     reason: "Unauthorized access attempt",
    //     addedOn: "2025-01-15T09:00:00.000Z",
    //   },
    //   {
    //     id: "BL-67890",
    //     name: "Troublemaker Two",
    //     idNumber: "ID002",
    //     mobile: "4445556666",
    //     reason: "Disruptive behavior",
    //     addedOn: "2025-03-01T15:00:00.000Z",
    //   },
    // ];
    return [];
  }

  _saveAllMockData() {
    localStorage.setItem("mock_visitors", JSON.stringify(this.mockVisitors));
    localStorage.setItem("mock_visits", JSON.stringify(this.mockVisits));
    localStorage.setItem("mock_blacklist", JSON.stringify(this.mockBlacklist));
  }

  // fetches the list of all registered visitors.
  async fetchVisitors() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockVisitors);
      }, 500);
    });
  }

  // fetches the list of all visit records.
  async fetchAllVisits() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockVisits);
      }, 500);
    });
  }

  // fetches the list of all blacklisted visitors.
  async fetchBlacklist() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockBlacklist);
      }, 500);
    });
  }

  // Adds a visitor entry to the blacklist.
  async addToBlacklist(entry) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if already in blacklist (by email or phone)
        const exists = this.mockBlacklist.some(
          (b) => b.email === entry.email || b.mobile === entry.mobile
        );
        if (exists) {
          return reject(
            new Error("Visitor with this email or phone already in blacklist.")
          );
        }

        // Mark visitor as blocked
        const visitor = this.mockVisitors.find(
          (v) => v.email === entry.email || v.phone === entry.mobile
        );
        if (visitor) {
          visitor.isBlocked = true;
        }

        // Add to blacklist
        const newEntry = {
          id: generateUniqueId("BL"),
          addedOn: new Date().toISOString(),
          ...entry,
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

  // Removes a visitor entry from the blacklist.
  async removeFromBlacklist(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Find the blacklist entry to be removed
        const entryToRemove = this.mockBlacklist.find(
          (entry) => entry.id === id
        );
        if (!entryToRemove) {
          return reject(new Error("Blacklist entry not found."));
        }

        // Mark visitor as unblocked
        const visitor = this.mockVisitors.find(
          (v) =>
            v.email === entryToRemove.email || v.phone === entryToRemove.mobile
        );
        if (visitor) {
          visitor.isBlocked = false;
        }

        // Remove from blacklist
        this.mockBlacklist = this.mockBlacklist.filter(
          (entry) => entry.id !== id
        );
        this._saveAllMockData();
        resolve({ success: true, message: "Removed from blacklist" });
      }, 300);
    });
  }

  // Exports all visits for a specific host as a JSON file.
  async exportHostVisitsToJson(hostName) {
    try {
      const response = await this.fetchVisitsByHost(hostName);
      const hostVisits = response.visits || [];

      const jsonString = JSON.stringify(hostVisits, null, 2); // 2 spaces for indentation

      const blob = new Blob([jsonString], { type: "application/json" });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      const date = new Date().toISOString().slice(0, 10); // e.g., "2025-06-11"
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

  // Fetches visitor data by ID.
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
            return dateB - dateA; // Sort by most recent visit
          });

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

  // Registers a new visitor
  async registerVisitor(visitorData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const emailToCompare = visitorData.email?.toLowerCase().trim();
        const phoneToCompare = visitorData.phone?.trim();

        let existingVisitor = this.mockVisitors.find(
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
            idNumber: visitorData.idNumber || existingVisitor.idNumber,
            photo: visitorData.photo || existingVisitor.photo,
            idProof: visitorData.idProof || existingVisitor.idProof,
            // isBlocked and registrationDate should ideally not be updated via this path
          });
          this._saveAllMockData();
          resolve({
            success: true,
            message: "Visitor already registered. Info updated.",
            visitorId: existingVisitor.id,
            visitor: existingVisitor,
          });
        } else {
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
            isVIP: visitorData.isVIP ?? false,
            isBlocked: visitorData.isBlocked ?? false,
            registrationDate: new Date().toISOString(),
          };

          this.mockVisitors.push(newVisitor);
          this._saveAllMockData();
          console.log(
            `Mock: New visitor profile registered, ID: ${newVisitor.id}`
          );
          resolve({
            success: true,
            message: "Visitor registered successfully.",
            visitorId: newVisitor.id,
            visitor: newVisitor,
          });
        }
      }, 500);
    });
  }

  // Requests a visit
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

  // Checks if a visitor is on the blacklist
  async isVisitorOnBlacklist(visitor, blacklist) {
    if (!visitor || !blacklist || blacklist.length === 0) {
      return false;
    }
    return blacklist.some((blockedEntry) => {
      const visitorEmail = visitor.email?.toLowerCase().trim();
      const visitorIdNumber = visitor.idNumber?.toLowerCase().trim();
      const visitorMobile = visitor.phone?.replace(/\D/g, ""); // Use visitor.phone for consistency

      const blockedEmail = blockedEntry.email?.toLowerCase().trim();
      const blockedIdNumber = blockedEntry.idNumber?.toLowerCase().trim();
      const blockedMobile = blockedEntry.mobile?.replace(/\D/g, "");

      return (
        (visitorEmail && blockedEmail && visitorEmail === blockedEmail) ||
        (visitorIdNumber &&
          blockedIdNumber &&
          visitorIdNumber === blockedIdNumber) ||
        (visitorMobile && blockedMobile && visitorMobile === blockedMobile)
      );
    });
  }

  // Uploads an ID proof
  async uploadIdProof(visitorId, idType, idNumber, idFileBase64, mimeType) {
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

        visitor.idProof = {
          type: idType,
          number: idNumber,
          data: idFileBase64,
          mimeType: mimeType,
          uploadDate: new Date().toISOString(),
        };
        visitor.idNumber = idNumber;

        this._saveAllMockData();

        console.log(
          `Mock: ID proof uploaded for visitor ${visitorId}. Type: ${idType}, Number: ${idNumber}`
        );
        resolve({
          success: true,
          message: "ID proof uploaded successfully (mock).",
        });
      }, 1000);
    });
  }

  // Updates a visitor's profile
  async updateProfile(visitorId, updatedData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const visitorIndex = this.mockVisitors.findIndex(
          (v) => v.id === visitorId
        );

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
        this._saveAllMockData();

        console.log(
          `Mock: Profile updated for visitor ${visitorId}.`,
          updatedData
        );
        resolve({
          success: true,
          message: "Profile updated successfully (mock).",
        });
      }, 700);
    });
  }

  // Cancels a visit
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

  // Uploads a photo
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

  // Checks-in or checks-out a visit
  async checkInOutVisit(visitId) {
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        const visitIndex = this.mockVisits.findIndex((v) => v.id === visitId);

        if (visitIndex === -1) {
          return reject(new Error("Visit ID not found. Please verify."));
        }

        const visit = this.mockVisits[visitIndex];
        const visitor = this.mockVisitors.find((v) => v.id === visit.visitorId);

        if (!visitor) {
          return reject(new Error("Associated visitor not found."));
        }

        //Blacklist Check
        const blacklist = await this.fetchBlacklist();
        if (await this.isVisitorOnBlacklist(visitor, blacklist)) {
          return reject(
            new Error(`Visitor ${visitor.name} is blacklisted. Access denied.`)
          );
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

        this._saveAllMockData();

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
  }

  // Fetches today's visits
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
                    email: visitor.email,
                    phone: visitor.phone,
                    idNumber: visitor.idNumber,
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

  // Fetches all visits for a specific host
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

  // Updates the status of a visit
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

  // Exports admin data to a JSON file
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

// Export a single instance of the VisitorService
export default new VisitorService();
