// js/views/visitor/idUpload.js

import VisitorService from "../../../api/visitorApi.js";
import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";

export function showIdUploadModal(visitorId, onSuccess) {
  const modals = document.getElementById("modals-container");
  modals.innerHTML = `
    <div class="modal fade" id="idUploadModal" tabindex="-1" aria-labelledby="idUploadModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
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
                  <option value="Aadhar Card">Aadhar Card</option>
                  <option value="PAN Card">PAN Card</option>
                  <option value="Passport">Passport</option>
                  <option value="Driver License">Driver's License</option>
                  <option value="National ID">National ID</option>
                  <option value="Company ID">Company ID</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="idFileInput" class="form-label">Upload File (Image or PDF)</label>
                <input type="file" id="idFileInput" name="idFile" class="form-control" accept="image/*,.pdf" required>
                <small class="form-text text-muted">Max file size 5MB. Accepted formats: JPG, PNG, PDF.</small>
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

  const modalElement = document.getElementById("idUploadModal");
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

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

      const idType = formElements.idType.value; // This is idName
      // REMOVED: const idNumber = formElements.idNumber.value.trim();
      const idFile = formElements.idFile.files[0]; // This is idProof (file)

      if (!idFile) {
        showAlert(
          modalElement,
          "Please select an ID file to upload.",
          "warning"
        );
        return;
      }

      const MAX_FILE_SIZE_MB = 5;
      const acceptedTypes = ["image/jpeg", "image/png", "application/pdf"];

      if (idFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        showAlert(
          modalElement,
          `File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`,
          "danger"
        );
        return;
      }
      if (!acceptedTypes.includes(idFile.type)) {
        showAlert(
          modalElement,
          `Unsupported file type. Please upload JPG, PNG, or PDF.`,
          "danger"
        );
        return;
      }

      showLoading(modalElement);

      try {
        const reader = new FileReader();
        reader.readAsDataURL(idFile);

        await new Promise((resolve, reject) => {
          reader.onload = async () => {
            const idFileBase64 = reader.result; // This will be stored as idProof

            const result = await VisitorService.uploadIdProof(
              visitorId,
              idType, // Maps to visitorData.idName
              idFileBase64 // Maps to visitorData.idProof
            );

            if (result.success) {
              modal.hide();
              showAlert(document.body, result.message, "success");
              if (onSuccess) {
                onSuccess();
              }
              resolve();
            } else {
              showAlert(modalElement, result.message, "danger");
              reject(new Error(result.message));
            }
          };

          reader.onerror = (error) => {
            console.error("FileReader error:", error);
            showAlert(modalElement, "Failed to read ID file.", "danger");
            reject(new Error("Failed to read ID file."));
          };
        });
      } catch (error) {
        console.error("Error during ID upload:", error);
        showAlert(
          modalElement,
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
