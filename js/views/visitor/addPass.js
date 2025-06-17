// js/views/visitor/addPass.js
import VisitorService from "../../../api/visitorApi.js";
import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";

let requestVisitButtonHandler = null;

export async function showVisitRequestModal(visitorId, visitorName, onSuccess) {
  const modals = document.getElementById("modals-container");
  modals.innerHTML = "";

  showLoading();
  let hosts = [];
  try {
    hosts = await VisitorService.fetchHosts();
  } catch (error) {
    showAlert(
      document.body,
      "Failed to load hosts: " + error.message,
      "danger"
    );
    hideLoading();
    return;
  } finally {
    hideLoading();
  }

  const hostOptions = hosts
    .map((host) => `<option value="${host.id}">${host.name}</option>`)
    .join("");

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
                <select id="hostPerson" name="hostId" class="form-select" required>
                  <option value="">Select a host</option>
                  ${hostOptions}
                </select>
              </div>
              <div class="mb-3">
                <label for="visitDate" class="form-label">Visit Date</label>
                <input type="date" id="visitDate" name="visitDate" class="form-control" required min="${
                  new Date().toISOString().split("T")[0]
                }">
              </div>
              <div class="mb-3">
                <label class="form-label">Visit Duration</label>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="visitDuration" id="morningVisit" value="morning" checked required>
                  <label class="form-check-label" for="morningVisit">
                    Morning (9 AM - 1 PM)
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="visitDuration" id="afternoonVisit" value="afternoon">
                  <label class="form-check-label" for="afternoonVisit">
                    Afternoon (2 PM - 6 PM)
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="visitDuration" id="fullDayVisit" value="fullday">
                  <label class="form-check-label" for="fullDayVisit">
                    Full Day (9 AM - 6 PM)
                  </label>
                </div>
              </div>
              <div class="mb-3">
                <label for="additionalNotes" class="form-label">Additional Notes</label>
                <textarea id="additionalNotes" name="notes" class="form-control" rows="3" required></textarea>
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
        const selectedHostId = formElements.hostId.value;
        const selectedHost = hosts.find((h) => h.id === selectedHostId);
        const hostName = selectedHost ? selectedHost.name : "";

        // Calculate time slots based on duration
        const visitDate = new Date(formElements.visitDate.value);
        let startTime, endTime;

        switch (formElements.visitDuration.value) {
          case "morning":
            startTime = new Date(visitDate.setHours(9, 0, 0, 0));
            endTime = new Date(visitDate.setHours(13, 0, 0, 0));
            break;
          case "afternoon":
            startTime = new Date(visitDate.setHours(14, 0, 0, 0));
            endTime = new Date(visitDate.setHours(18, 0, 0, 0));
            break;
          case "fullday":
            startTime = new Date(visitDate.setHours(9, 0, 0, 0));
            endTime = new Date(visitDate.setHours(18, 0, 0, 0));
            break;
        }

        const visitData = {
          purpose: formElements.purpose.value,
          host: hostName,
          hostId: selectedHostId,
          visitDate: visitDate.toISOString(),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          duration: formElements.visitDuration.value,
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
          if (onSuccess) onSuccess();
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
