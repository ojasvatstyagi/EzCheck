// js/views/visitor/photoUpload.js
import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";

export function handlePhotoUpload(visitorId, onSuccess) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async (e) => {
    if (e.target.files.length) {
      try {
        showLoading();

        // Create FormData for photo upload
        const formData = new FormData();
        formData.append("photo", e.target.files[0]);

        // TODO: Implement actual photo upload API call
        // await uploadPhoto(visitorId, formData);

        // Temporary success message - replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

        showAlert(document.body, "Photo updated successfully", "success");

        // Call the success callback to refresh the view
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        showAlert(document.body, "Failed to upload photo", "danger");
      } finally {
        hideLoading();
      }
    }
  };
  input.click();
}

export function setupPhotoUploadListener(visitorId, onSuccess) {
  document.getElementById("uploadPhotoBtn")?.addEventListener("click", () => {
    handlePhotoUpload(visitorId, onSuccess);
  });
}
