// js/views/visitor/photoUpload.js
import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";
import VisitorService from "../../../api/visitorApi.js";
export function handlePhotoUpload(visitorId, onUploadSuccess) {
  // Renamed onSuccess to onUploadSuccess for clarity
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      const visitorPhotoElement = document.getElementById("visitorPhoto");
      let originalPhotoSrc = visitorPhotoElement
        ? visitorPhotoElement.src
        : null; // Store original src

      // --- 1. Client-Side Preview (Immediate Update) ---
      if (file && visitorPhotoElement) {
        const reader = new FileReader();
        reader.onload = function (event) {
          visitorPhotoElement.src = event.target.result; // Display local preview
        };
        reader.readAsDataURL(file);
      }

      try {
        showLoading();

        const formData = new FormData();
        formData.append("photo", file);

        // --- 2. Actual API Call (Backend Update) ---
        const response = await VisitorService.uploadPhoto(visitorId, formData);

        if (response.success) {
          showAlert(
            document.body,
            response.message || "Photo updated successfully",
            "success"
          );
          // --- IMPORTANT: Call the success callback to re-render the profile ---
          if (onUploadSuccess) {
            onUploadSuccess(); // Call the function passed from visitor.js to re-render
          }
        } else {
          showAlert(
            document.body,
            response.message || "Failed to upload photo.",
            "danger"
          );
          // If upload fails, revert to the original photo
          if (visitorPhotoElement && originalPhotoSrc) {
            visitorPhotoElement.src = originalPhotoSrc;
          }
        }
      } catch (error) {
        console.error("Error uploading photo:", error);
        showAlert(
          document.body,
          "Failed to upload photo: " + error.message,
          "danger"
        );
        // If an error occurs, revert to the original photo
        if (visitorPhotoElement && originalPhotoSrc) {
          visitorPhotoElement.src = originalPhotoSrc;
        }
      } finally {
        hideLoading();
      }
    }
  };
  input.click();
}

export function setupPhotoUploadListener(visitorId, onUploadSuccess) {
  // Renamed onSuccess
  document.getElementById("uploadPhotoBtn")?.addEventListener("click", () => {
    handlePhotoUpload(visitorId, onUploadSuccess);
  });
}
