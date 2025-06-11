// js/views/visitor/registerVisitor.js
import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";
import VisitorService from "../../../api/visitorApi.js";
import { getCurrentUser } from "../../utils/helpers.js";

export function setupRegisterVisitorModal(onSuccessCallback, options = {}) {
  const modalsContainer = document.getElementById("modals-container");
  if (!modalsContainer) {
    console.error("Modal container not found!");
    return;
  }

  const currentUser = getCurrentUser();
  const prefillHostName =
    options.prefillHostName ||
    (options.isHostRegistering ? currentUser?.username : "");
  const isHostRegistering =
    options.isHostRegistering || currentUser?.role === "host";

  modalsContainer.innerHTML = `
    <div class="modal fade" id="registerVisitorModal" tabindex="-1" aria-labelledby="registerVisitorModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="registerVisitorModalLabel">Register New Visitor & Request Visit</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4">
            <form id="registerVisitorForm">
              <h5 class="mb-3 text-dark">Visitor Information</h5>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="visitorNameInput" class="form-label">Full Name</label>
                  <input type="text" class="form-control" id="visitorNameInput" name="name" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="visitorPhoneInput" class="form-label">Phone Number</label>
                  <input type="tel" class="form-control" id="visitorPhoneInput" name="phone" required>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="visitorEmailInput" class="form-label">Email Address</label>
                  <input type="email" class="form-control" id="visitorEmailInput" name="email">
                </div>
                <div class="col-md-6 mb-3">
                  <label for="visitorCompanyInput" class="form-label">Company (Optional)</label>
                  <input type="text" class="form-control" id="visitorCompanyInput" name="company">
                </div>
              </div>
              <hr class="my-4">
              <h5 class="mb-3 text-dark">Visit Information</h5>
              <div class="mb-3">
                <label for="purposeInput" class="form-label">Purpose of Visit</label>
                <select class="form-select" id="purposeInput" name="purpose" required>
                  <option value="">Select purpose</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Interview">Interview</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="hostInput" class="form-label">Host/Contact Person</label>
                <input type="text" class="form-control" id="hostInput" name="host" required ${
                  prefillHostName
                    ? `value="${prefillHostName}" ${
                        isHostRegistering ? "readonly" : ""
                      }`
                    : ""
                }>
              </div>
              <div class="mb-3">
                <label for="visitDateInput" class="form-label">Scheduled Date/Time</label>
                <input type="datetime-local" class="form-control" id="visitDateInput" name="visitDate" required>
              </div>
              <div class="mb-3">
                <label for="notesInput" class="form-label">Additional Notes</label>
                <textarea class="form-control" id="notesInput" name="notes" rows="3"></textarea>
              </div>
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="isWalkInCheckbox" ${
                  options.forceWalkIn ? "checked disabled" : ""
                }>
                <label class="form-check-label" for="isWalkInCheckbox">
                  This is a walk-in visitor (immediate check-in)
                </label>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" form="registerVisitorForm" class="btn btn-outline-primary-custom">Register & Request Visit</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const modalElement = document.getElementById("registerVisitorModal");
  const registerVisitorForm = document.getElementById("registerVisitorForm");
  const visitDateInput = document.getElementById("visitDateInput");
  const isWalkInCheckbox = document.getElementById("isWalkInCheckbox");

  if (visitDateInput) {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    visitDateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  registerVisitorForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    showLoading(modalElement);

    const visitorData = {
      name: document.getElementById("visitorNameInput").value.trim(),
      phone: document.getElementById("visitorPhoneInput").value.trim(),
      email: document.getElementById("visitorEmailInput").value.trim(),
      company: document.getElementById("visitorCompanyInput").value.trim(),
    };

    const visitData = {
      purpose: document.getElementById("purposeInput").value.trim(),
      host: document.getElementById("hostInput").value.trim(),
      visitDate: document.getElementById("visitDateInput").value,
      notes: document.getElementById("notesInput").value.trim(),
    };

    const isWalkIn = isWalkInCheckbox.checked;

    try {
      const blacklist = await VisitorService.fetchBlacklist();
      const isBlocked = await VisitorService.isVisitorOnBlacklist(
        visitorData,
        blacklist
      );

      if (isBlocked) {
        showAlert(
          modalElement, // Alert inside the modal
          "This visitor is blacklisted. Registration denied.",
          "danger"
        );
        hideLoading();
        return;
      }

      const registrationResult = await VisitorService.registerVisitor(
        visitorData
      );

      if (!registrationResult.success) {
        showAlert(modalElement, registrationResult.message, "danger");
        hideLoading();
        return;
      }

      const visitorId = registrationResult.visitorId;
      console.log("Visitor ID after registration:", visitorId);
      const visitRequestResult = await VisitorService.requestVisit(
        visitorId,
        registrationResult.visitor.name || visitorData.name, // Pass visitorName
        visitData,
        isWalkIn
      );

      if (visitRequestResult.success) {
        modal.hide();
        showAlert(document.body, visitRequestResult.message, "success");
        if (onSuccessCallback) {
          onSuccessCallback(visitRequestResult.visit);
        }
      } else {
        showAlert(
          modalElement,
          visitRequestResult.message ||
            "Failed to register visitor or request visit.",
          "danger"
        );
      }
    } catch (error) {
      console.error("Registration/Visit Request error:", error);
      showAlert(modalElement, `An error occurred: ${error.message}`, "danger");
    } finally {
      hideLoading();
    }
  });

  modalElement.addEventListener("hidden.bs.modal", function (event) {
    modalsContainer.innerHTML = "";
  });
}
