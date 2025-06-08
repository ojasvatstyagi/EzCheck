// js/views/visitor/updateProfile.js
import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";
import VisitorService from "../../../api/visitorApi.js";

export function setupProfileUpdateListener(visitorId, refreshCallback) {
  const profileSection = document.getElementById("profile-section");

  // Listener for the "Edit Profile" button (in view mode)
  profileSection.addEventListener("click", (e) => {
    if (e.target.id === "editProfileBtn") {
      refreshCallback(true); // Pass true to indicate edit mode
    }
  });

  // Listener for the "Save Changes" button (in edit mode)
  // Use event delegation on the form or a parent element
  profileSection.addEventListener("submit", async (e) => {
    if (e.target.id === "profileEditForm") {
      e.preventDefault(); // Prevent default form submission

      const form = e.target;
      const updatedData = {
        name: form.elements.profileName.value,
        email: form.elements.profileEmail.value,
        phone: form.elements.profilePhone.value,
        company: form.elements.profileCompany.value,
        idNumber: form.elements.profileIdNumber.value,
      };

      try {
        showLoading();
        const response = await VisitorService.updateProfile(
          visitorId,
          updatedData
        );

        if (response.success) {
          showAlert(
            document.body,
            response.message || "Profile updated successfully!",
            "success"
          );
          refreshCallback(); // Re-render the view to show updated data (back to view mode)
        } else {
          showAlert(
            document.body,
            response.message || "Failed to update profile.",
            "danger"
          );
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        showAlert(
          document.body,
          "Error updating profile: " + error.message,
          "danger"
        );
      } finally {
        hideLoading();
      }
    }
  });

  // Listener for the "Cancel" button (in edit mode)
  profileSection.addEventListener("click", (e) => {
    if (e.target.id === "cancelEditBtn") {
      refreshCallback(); // Re-render the view to revert to view mode (without saving)
    }
  });
}
