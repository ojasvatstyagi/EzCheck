// js/views/visitor/addPass.js
import { requestVisit } from "../../../api/visitorApi.js";
import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";

export function showVisitRequestModal(visitorId, onSuccess) {
  const modals = document.getElementById("modals-container");
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
                <label class="form-label">Purpose of Visit</label>
                <select class="form-select" required>
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
                <input type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Visit Date</label>
                <input type="datetime-local" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Additional Notes</label>
                <textarea class="form-control" rows="3"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" form="visitRequestForm" class="btn btn-primary">Submit Request</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const modal = new bootstrap.Modal(
    document.getElementById("requestVisitModal")
  );
  modal.show();

  document
    .getElementById("visitRequestForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        showLoading();

        const visitData = {
          purpose: e.target.elements[0].value,
          host: e.target.elements[1].value,
          date: e.target.elements[2].value,
          notes: e.target.elements[3].value,
        };

        await requestVisit(visitorId, visitData);
        modal.hide();
        showAlert(
          document.body,
          "Visit request submitted successfully",
          "success"
        );

        // Call the success callback to refresh the view
        if (onSuccess) {
          onSuccess();
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

export function setupVisitRequestListener(visitorId, onSuccess) {
  document.getElementById("requestVisitBtn")?.addEventListener("click", () => {
    showVisitRequestModal(visitorId, onSuccess);
  });
}
