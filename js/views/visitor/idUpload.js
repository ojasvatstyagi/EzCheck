// js/views/visitor/idUpload.js
import VisitorService from "../../../api/visitorApi.js";
import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";

export function showIdUploadModal(visitorId, onSuccess) {
  const modals = document.getElementById("modals-container");
  modals.innerHTML = `
    <div class="modal fade" id="idUploadModal" tabindex="-1" aria-labelledby="idUploadModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="idUploadModalLabel">Upload ID Proof</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="idUploadForm">
              <div class="mb-3">
                <label for="idTypeSelect" class="form-label">ID Type</label>
                <select id="idTypeSelect" name="idType" class="form-select" required>
                  <option value="">Select ID type</option>
                  <option value="Driver License">Driver's License</option>
                  <option value="Passport">Passport</option>
                  <option value="National ID">National ID</option>
                  <option value="Company ID">Company ID</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="idNumberInput" class="form-label">ID Number</label>
                <input type="text" id="idNumberInput" name="idNumber" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="idFileInput" class="form-label">Upload File</label>
                <input type="file" id="idFileInput" name="idFile" class="form-control" accept="image/*,.pdf,.doc,.docx" required>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" form="idUploadForm" class="btn btn-outline-primary-custom">Upload ID</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Initialize and show the Bootstrap modal
  const modalElement = document.getElementById("idUploadModal");
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Add event listener to move focus and clear modal on close
  modalElement.addEventListener(
    "hidden.bs.modal",
    () => {
      document.body.focus();
      modals.innerHTML = "";
    },
    { once: true }
  );

  document
    .getElementById("idUploadForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const formElements = e.target.elements;

      const idType = formElements.idType.value;
      const idNumber = formElements.idNumber.value.trim();
      const idFile = formElements.idFile.files[0];

      if (!idFile) {
        showAlert(
          document.body,
          "Please select an ID file to upload.",
          "warning"
        );
        return;
      }

      showLoading(modalElement);

      try {
        const reader = new FileReader();
        reader.readAsDataURL(idFile);

        await new Promise((resolve, reject) => {
          reader.onload = async () => {
            const idFileBase64 = reader.result;

            const result = await VisitorService.uploadIdProof(
              visitorId,
              idType,
              idNumber,
              idFileBase64,
              idFile.type
            );

            if (result.success) {
              modal.hide();
              showAlert(document.body, result.message, "success");
              if (onSuccess) {
                onSuccess();
              }
              resolve();
            } else {
              showAlert(document.body, result.message, "danger");
              reject(new Error(result.message));
            }
          };

          reader.onerror = (error) => {
            console.error("FileReader error:", error);
            showAlert(document.body, "Failed to read ID file.", "danger");
            reject(new Error("Failed to read ID file."));
          };
        });
      } catch (error) {
        console.error("Error during ID upload:", error);
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

export function setupIdUploadListener(visitorId, onSuccess) {
  document.getElementById("uploadIdBtn")?.addEventListener("click", () => {
    showIdUploadModal(visitorId, onSuccess);
  });
}
