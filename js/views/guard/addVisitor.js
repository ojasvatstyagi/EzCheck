// js/views/guard/addVisitor.js
import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";
import VisitorService from "../../../api/visitorApi.js";

export default function initAddVisitorView(onVisitorCheckedInCallback) {
  const content = document.getElementById("guard-dynamic-content");
  if (!content) return;

  // Render the initial HTML structure for the add visitor view (form only)
  content.innerHTML = `
    <div class="container mt-4 mb-4">
      <div class="card shadow-sm rounded-4">
        <div class="card-header bg-light text-dark rounded-top-4">
          <h3 class="mb-0">Register New Walk-in Visitor & Request Visit</h3>
        </div>
        <div class="card-body p-4">
          <form id="walkin-form">
            <h5 class="mb-3 text-dark">Visitor Information</h5>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="fullName" class="form-label">Full Name</label>
                <input type="text" id="fullName" name="fullName" class="form-control" required />
              </div>
              <div class="col-md-6 mb-3">
                <label for="phone" class="form-label">Phone Number</label>
                <input type="tel" id="phone" name="phone" class="form-control" required />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="email" class="form-label">Email Address</label>
                <input type="email" id="email" name="email" class="form-control" />
              </div>
              <div class="col-md-6 mb-3">
                <label for="company" class="form-label">Company</label>
                <input type="text" id="company" name="company" class="form-control" />
              </div>
            </div>
            <hr class="my-4">
            <h5 class="mb-3 text-dark">Visit Information</h5>
            <div class="mb-3">
              <label class="form-label">Purpose of Visit</label>
              <select class="form-select" id="purpose" required>
                <option value="">Select purpose</option>
                <option value="Meeting">Meeting</option>
                <option value="Delivery">Delivery</option>
                <option value="Interview">Interview</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Host/Contact Person</label>
              <input type="text" id="host" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Visit Date (Today's Date/Time)</label>
              <input type="datetime-local" id="visitDate" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Additional Notes</label>
              <textarea class="form-control" id="notes" rows="3"></textarea>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-4">
              <button type="submit" class="btn btn-outline-primary-custom btn-md">
                <i class="fas fa-user-plus me-2"></i> Register & Check-In
              </button>
              <button type="button" id="backToDashboardBtn" class="btn btn-outline-secondary">
                <i class="fas fa-arrow-left me-2"></i> Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  // Get references to elements AFTER they have been rendered into the DOM
  const walkinForm = document.getElementById("walkin-form");
  const visitDateInput = document.getElementById("visitDate");
  const backToDashboardBtn = document.getElementById("backToDashboardBtn");

  // Set default current date/time for the visitDate input
  if (visitDateInput) {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    visitDateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Event listener for the "Back" button
  backToDashboardBtn?.addEventListener("click", () => {
    // This callback is intended to signal the parent (guard.js) to navigate
    if (onVisitorCheckedInCallback) {
      // Renamed callback for clarity
      onVisitorCheckedInCallback(null, "Returned to dashboard.", "info"); // Pass null for visitor data
    }
  });

  // Event listener for the main form submission
  walkinForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    showLoading(content);

    const visitorName = document.getElementById("fullName").value.trim(); // Capture name here
    const visitorData = {
      name: visitorName,
      phone: document.getElementById("phone").value.trim(),
      email: document.getElementById("email").value.trim(),
      company: document.getElementById("company").value.trim(),
    };

    const visitData = {
      purpose: document.getElementById("purpose").value.trim(),
      host: document.getElementById("host").value.trim(),
      visitDate: document.getElementById("visitDate").value, // Use the selected date/time
      notes: document.getElementById("notes").value.trim(),
    };

    try {
      // --- STEP 1: Check if visitor is blacklisted ---
      const blacklist = await VisitorService.fetchBlacklist();
      const isBlocked = await VisitorService.isVisitorOnBlacklist(
        visitorData,
        blacklist
      );

      if (isBlocked) {
        showAlert(
          content,
          "This visitor is blacklisted. Registration denied.",
          "danger"
        );
        hideLoading();
        return;
      }

      // --- STEP 2: Register or get existing visitor ID ---
      const registrationResult = await VisitorService.registerVisitor(
        visitorData
      );

      if (!registrationResult.success) {
        showAlert(content, registrationResult.message, "danger");
        hideLoading();
        return;
      }

      const visitorId = registrationResult.visitorId;
      console.log("Visitor ID after registration:", visitorId);

      // --- STEP 3: Request visit for this visitor, marking it as a walk-in for immediate check-in ---
      const visitRequestResult = await VisitorService.requestVisit(
        visitorId,
        visitData,
        true // isWalkIn = true
      );

      if (visitRequestResult.success) {
        // Clear the form for the next entry
        walkinForm.reset();
        // Reset the datetime-local input to current time for the new form
        if (visitDateInput) {
          const now = new Date();
          const year = now.getFullYear();
          const month = (now.getMonth() + 1).toString().padStart(2, "0");
          const day = now.getDate().toString().padStart(2, "0");
          const hours = now.getHours().toString().padStart(2, "0");
          const minutes = now.getMinutes().toString().padStart(2, "0");
          visitDateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
        }

        // Send the successful check-in data back to the guard dashboard
        if (onVisitorCheckedInCallback) {
          onVisitorCheckedInCallback(
            {
              // Data to pass back
              visitorName: visitorName, // This is already correctly captured and passed
              visitorId: visitorId,
              visitId: visitRequestResult.visitId,
              status: "Checked-In",
              checkInTime: new Date().toISOString(),
              purpose: visitData.purpose,
              host: visitData.host,
            },
            `Visitor ${visitorName} checked in successfully!`, // Alert message
            "success" // Alert type
          );
        }
      } else {
        showAlert(
          content,
          visitRequestResult.message ||
            "Failed to register visitor or request visit.",
          "danger"
        );
      }
    } catch (error) {
      console.error("Walk-in registration error:", error);
      showAlert(
        content,
        `Failed to register visitor or request visit: ${error.message}`,
        "danger"
      );
    } finally {
      hideLoading();
    }
  });
}
