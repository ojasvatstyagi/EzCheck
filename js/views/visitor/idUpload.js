// js/views/visitor/idUpload.js
import { uploadIdProof } from "../../../api/visitorApi.js";
import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";

export function showIdUploadModal(visitorId, onSuccess) {
  const modals = document.getElementById("modals-container");
  modals.innerHTML = `
    <div class="modal fade" id="idUploadModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">Upload ID Proof</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="idUploadForm">
              <div class="mb-3">
                <label class="form-label">ID Type</label>
                <select class="form-select" required>
                  <option value="">Select ID type</option>
                  <option value="Driver License">Driver's License</option>
                  <option value="Passport">Passport</option>
                  <option value="National ID">National ID</option>
                  <option value="Company ID">Company ID</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">ID Number</label>
                <input type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Upload File</label>
                <input type="file" class="form-control" accept="image/*,.pdf" required>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" form="idUploadForm" class="btn btn-primary">Upload ID</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById("idUploadModal"));
  modal.show();

  document
    .getElementById("idUploadForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        showLoading();
        const formData = new FormData();
        formData.append("idType", e.target.elements[0].value);
        formData.append("idNumber", e.target.elements[1].value);
        formData.append("idFile", e.target.elements[2].files[0]);

        await uploadIdProof(visitorId, formData);
        modal.hide();
        showAlert(document.body, "ID proof uploaded successfully", "success");

        // Call the success callback to refresh the view
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        showAlert(
          document.body,
          "Failed to upload ID: " + error.message,
          "danger"
        );
      } finally {
        hideLoading();
      }
    });
}

export function setupIdUploadListener(visitorId, onSuccess) {
  document.getElementById("uploadIdBtn")?.addEventListener("click", () => {
    showIdUploadModal(visitorId, onSuccess);
  });
}
