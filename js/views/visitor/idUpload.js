// js/views/visitor/idUpload.js
import VisitorService from "../../../api/visitorApi.js";
import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";

export function showIdUploadModal(visitorId, onSuccess) {
  const modals = document.getElementById("modals-container");
  // Ensure the modals container is clean before adding new modal HTML
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

  // Attach event listener for the form submission within the modal
  document
    .getElementById("idUploadForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent default form submission
      const formElements = e.target.elements;

      const idType = formElements.idType.value;
      const idNumber = formElements.idNumber.value.trim();
      const idFile = formElements.idFile.files[0]; // Get the actual File object

      if (!idFile) {
        showAlert(
          document.body,
          "Please select an ID file to upload.",
          "warning"
        );
        return;
      }

      showLoading(modalElement); // Show loading inside the modal

      try {
        // Use FileReader to read the file as a Data URL (Base64 encoded)
        const reader = new FileReader();
        reader.readAsDataURL(idFile);

        await new Promise((resolve, reject) => {
          reader.onload = async () => {
            const idFileBase64 = reader.result; // This is the Base64 string

            // Call the VisitorService to upload the ID proof
            const result = await VisitorService.uploadIdProof(
              visitorId,
              idType,
              idNumber,
              idFileBase64,
              idFile.type // Pass the MIME type for proper storage
            );

            if (result.success) {
              modal.hide(); // Hide the modal on success
              showAlert(document.body, result.message, "success");
              if (onSuccess) {
                onSuccess(); // Call the success callback to refresh the parent view (e.g., visitor profile)
              }
              resolve(); // Resolve the promise once operations are complete
            } else {
              showAlert(document.body, result.message, "danger");
              reject(new Error(result.message)); // Reject if service indicates failure
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
        hideLoading(); // Hide loading indicator
      }
    });
}

// This function sets up the event listener for the button that opens the ID upload modal
export function setupIdUploadListener(visitorId, onSuccess) {
  // Ensure the button actually exists before adding an event listener
  document.getElementById("uploadIdBtn")?.addEventListener("click", () => {
    showIdUploadModal(visitorId, onSuccess);
  });
}
