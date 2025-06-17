// js/views/visitor/updateProfile.js

import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";
import VisitorService from "../../../api/visitorApi.js";

export function setupProfileUpdateListener(visitorId, refreshCallback) {
  const profileSection = document.getElementById("profile-section");

  profileSection.addEventListener("click", (e) => {
    if (e.target.id === "editProfileBtn") {
      refreshCallback(true);
    }
  });

  profileSection.addEventListener("submit", async (e) => {
    if (e.target.id === "profileEditForm") {
      e.preventDefault();

      const form = e.target;
      const updatedData = {
        name: form.elements.profileName.value,
        phone: form.elements.profilePhone.value,
        company: form.elements.profileCompany.value,
      };

      const filteredData = Object.fromEntries(
        Object.entries(updatedData).filter(
          ([key, value]) => value.trim() !== ""
        )
      );

      try {
        showLoading(document.body);
        const response = await VisitorService.updateProfile(
          visitorId,
          filteredData
        );

        if (response.success) {
          showAlert(
            document.body,
            response.message || "Profile updated successfully!",
            "success"
          );
          refreshCallback();
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

  profileSection.addEventListener("click", (e) => {
    if (e.target.id === "cancelEditBtn") {
      refreshCallback();
    }
  });
}
