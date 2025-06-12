// js/views/visitor/addPass.js
import VisitorService from "../../../api/visitorApi.js";
import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";

let requestVisitButtonHandler = null;

// Corrected signature: visitorName is passed as the third parameter
export function showVisitRequestModal(visitorId, visitorName, onSuccess) {
  const modals = document.getElementById("modals-container");
  modals.innerHTML = "";

  modals.innerHTML = `
      <div class="modal fade" id="requestVisitModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header bg-dark text-white">
              <h5 class="modal-title">Request New Visit</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="visitRequestForm">
                <div class="mb-3">
                  <label for="purposeOfVisit" class="form-label">Purpose of Visit</label>
                  <select id="purposeOfVisit" name="purpose" class="form-select" required>
                    <option value="">Select purpose</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Interview">Interview</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="hostPerson" class="form-label">Host/Contact Person</label>
                  <input type="text" id="hostPerson" name="host" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label for="visitDateTime" class="form-label">Visit Date</label>
                  <input type="datetime-local" id="visitDateTime" name="visitDate" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label for="additionalNotes" class="form-label">Additional Notes</label>
                  <textarea id="additionalNotes" name="notes" class="form-control" rows="3"></textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" form="visitRequestForm" class="btn btn-outline-primary-custom">Submit Request</button>
            </div>
          </div>
        </div>
      </div>
    `;

  const modalElement = document.getElementById("requestVisitModal");
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  document
    .getElementById("visitRequestForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        showLoading();

        const formElements = e.target.elements;
        const visitData = {
          purpose: formElements.purpose.value,
          host: formElements.host.value,
          visitDate: formElements.visitDate.value, // This is `date`
          notes: formElements.notes.value,
        };
        const response = await VisitorService.requestVisit(
          visitorId,
          visitorName,
          visitData
        );
        if (response.success) {
          modal.hide();
          modalElement.addEventListener(
            "hidden.bs.modal",
            () => {
              document.body.focus();
              modals.innerHTML = "";
            },
            { once: true }
          );

          showAlert(
            document.body,
            response.message || "Visit request submitted successfully",
            "success"
          );
          if (onSuccess) {
            onSuccess(); // This is the refreshCallback from visitor.js
          }
        } else {
          showAlert(
            document.body,
            response.message || "Failed to submit request.",
            "danger"
          );
        }
      } catch (error) {
        showAlert(
          document.body,
          "Failed to submit request: " + error.message,
          "danger"
        );
      } finally {
        hideLoading();
      }
    });
}

// Corrected signature to accept visitorName as the second parameter, and onSuccess as the third
export function setupVisitRequestListener(visitorId, visitorName, onSuccess) {
  if (requestVisitButtonHandler) {
    document.removeEventListener("click", requestVisitButtonHandler);
  }

  requestVisitButtonHandler = (e) => {
    if (e.target.id === "requestVisitBtn") {
      showVisitRequestModal(visitorId, visitorName, onSuccess); // Pass all three arguments
    }
  };

  document.addEventListener("click", requestVisitButtonHandler);
}
