// js/views/visitor.js
import VisitorService from "../../../api/visitorApi.js";
import {
  showAlert,
  showLoading,
  hideLoading,
  generateQRCode,
} from "../utils/helpers.js"; // Assuming these are correct paths and exports
import { initProfileView } from "./visitor/profile.js";
import { renderVisitStatus } from "./visitor/currentPass.js";
import { renderVisitHistory } from "./visitor/visitHistory.js";
import { setupVisitRequestListener } from "./visitor/addPass.js";
import { setupVisitCancelListener } from "./visitor/visitCancel.js";
import { setupIdUploadListener } from "./visitor/idUpload.js";
import { setupPhotoUploadListener } from "./visitor/photoUpload.js";
import { setupProfileUpdateListener } from "./visitor/updateProfile.js";

// This function will handle the initial rendering and all subsequent re-renders
// Added 'editingMode' parameter to control profile view state
async function renderVisitorViewContent(visitorId, editingMode = false) {
  const content = document.getElementById("role-content");
  if (!content) return;

  showLoading(content);

  try {
    // or an object with a 'profile' property.
    const visitorData = await VisitorService.fetchVisitorData(visitorId);

    if (!visitorData || !visitorData.id) {
      // Ensure visitorData is a valid object and has an ID
      // This is the error path you were hitting, now correctly caught here
      showAlert(
        content,
        "Visitor profile not found. Please ensure you are logged in correctly.",
        "danger"
      );
      content.innerHTML = `<div class="alert alert-danger">Error: Visitor profile not found.</div>`;
      hideLoading();
      return;
    }

    if (visitorData.isBlocked) {
      content.innerHTML = `
        <div class="container mt-4 text-center">
          <div class="alert alert-danger" role="alert">
            <i class="fas fa-ban fa-3x mb-3"></i>
            <h4 class="alert-heading">Access Denied!</h4>
            <p>Your request cannot be processed at this time. You may not apply for new visits or access certain features.</p>
            <hr>
            <p class="mb-0">Please contact the administration for assistance.</p>
          </div>
        </div>
      `;
      hideLoading();
      return;
    }

    content.innerHTML = `
      <div class="container mt-4">
        <div class="row align-items-center">
          <div id="profile-section" class="col-md-5 mb-3"></div>
          <div id="current-pass-section" class="col-md-7 mb-3"></div>
        </div>
        <div id="visit-history-section" class="mb-3"></div>
        <div id="modals-container"></div>
      </div>
    `;

    // Render profile section, passing the editingMode
    // Assuming initProfileView, renderVisitStatus, renderVisitHistory return HTML strings
    document.getElementById("profile-section").innerHTML = `
      ${initProfileView(visitorData, editingMode)}
    `;
    document.getElementById("current-pass-section").innerHTML = `
      ${renderVisitStatus(visitorData)}
    `;
    document.getElementById("visit-history-section").innerHTML = `
      ${renderVisitHistory(visitorData)}
    `;

    if (visitorData.currentVisit?.status === "Approved") {
      await generateQRCode(
        "visitQrCode",
        `VISITOR:${visitorData.id}|VISIT:${visitorData.currentVisit.id}`
      );
    }

    // Pass the refresh function with a potential new editingMode
    setupEventListeners(
      visitorData.id,
      visitorData.currentVisit?.id,
      (newEditingMode = false) =>
        renderVisitorViewContent(visitorId, newEditingMode) // Pass newEditingMode to refresh
    );
  } catch (error) {
    console.error("Error rendering visitor view content:", error);
    showAlert(
      content,
      "Failed to load visitor data: " + error.message,
      "danger"
    );
  } finally {
    hideLoading();
  }
}

function setupEventListeners(visitorId, currentVisitId, refreshCallback) {
  setupVisitRequestListener(visitorId, refreshCallback);

  if (currentVisitId) {
    setupVisitCancelListener(currentVisitId, refreshCallback);
  }
  setupIdUploadListener(visitorId, refreshCallback);
  setupPhotoUploadListener(visitorId, refreshCallback);
  setupProfileUpdateListener(visitorId, refreshCallback);
}

export default async function initVisitorView() {
  const content = document.getElementById("role-content");
  if (!content) return;

  showLoading(content); // Show loader early in initVisitorView

  try {
    const userSessionData = JSON.parse(sessionStorage.getItem("user"));
    const visitorId = userSessionData ? userSessionData.visitorId : null;

    if (!visitorId) {
      console.error(
        "No visitor ID found in sessionStorage. Redirecting or showing error."
      );
      // window.location.href = "/index.html"; // Redirect to login page
      showAlert(
        content,
        "Please register or log in as a visitor to view this page.",
        "info"
      );
      return; // Stop execution
    }

    // Now call the main rendering function with the found visitorId
    await renderVisitorViewContent(visitorId);
  } catch (error) {
    console.error("Error during visitor view initialization:", error);
    showAlert(
      content,
      "An unexpected error occurred during page setup.",
      "danger"
    );
  } finally {
    hideLoading(); // Ensure loader is hidden even if there's an early exit or error
  }
}
