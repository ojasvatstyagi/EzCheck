// js/views/visitor.js
import VisitorService from "../../../api/visitorApi.js";
import {
  showAlert,
  showLoading,
  hideLoading,
  generateQRCode,
} from "../utils/helpers.js";
import { initProfileView } from "./visitor/profile.js";
import { renderVisitStatus } from "./visitor/currentPass.js";
import { renderVisitHistory } from "./visitor/visitHistory.js";
import { setupVisitRequestListener } from "./visitor/addPass.js";
import { setupVisitCancelListener } from "./visitor/visitCancel.js";
import { setupIdUploadListener } from "./visitor/idUpload.js";
import { setupPhotoUploadListener } from "./visitor/photoUpload.js";
import { setupProfileUpdateListener } from "./visitor/updateProfile.js";

async function renderVisitorViewContent(visitorId, editingMode = false) {
  const content = document.getElementById("role-content");
  if (!content) return;

  showLoading(content);

  try {
    const visitorData = await VisitorService.fetchVisitorData(visitorId);

    if (!visitorData || !visitorData.id) {
      showAlert(
        content,
        "Visitor profile not found. Please ensure you are logged in correctly.",
        "danger"
      );
      content.innerHTML = `<div class="alert alert-danger">Error: Visitor profile not found.</div>`;
      hideLoading();
      return;
    }

    // Always render the main structure
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

    // Always render profile section
    document.getElementById("profile-section").innerHTML = `
      ${initProfileView(visitorData, editingMode)}
    `;

    // Render current pass section based on blocked status
    if (visitorData.isBlocked) {
      document.getElementById("current-pass-section").innerHTML = `
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
    } else {
      document.getElementById("current-pass-section").innerHTML = `
        ${renderVisitStatus(visitorData)}
      `;

      if (visitorData.currentVisit?.status === "Approved") {
        await generateQRCode(
          "visitQrCode",
          `VISITOR ID:${visitorData.id}|NAME:${visitorData.name}|VISIT ID:${visitorData.currentVisit.id}`
        );
      }
    }

    // Always render visit history
    document.getElementById("visit-history-section").innerHTML = `
      ${renderVisitHistory(visitorData)}
    `;

    setupEventListeners(
      visitorData.id,
      visitorData.name,
      visitorData.currentVisit?.id,
      (newEditingMode = false) =>
        renderVisitorViewContent(visitorId, newEditingMode)
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

function setupEventListeners(
  visitorId,
  visitorName,
  currentVisitId,
  refreshCallback
) {
  setupVisitRequestListener(visitorId, visitorName, refreshCallback);

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

  showLoading(content);

  try {
    const userSessionData = JSON.parse(sessionStorage.getItem("user"));
    const visitorId = userSessionData ? userSessionData.visitorId : null;

    if (!visitorId) {
      console.error(
        "No visitor ID found in sessionStorage. Redirecting or showing error."
      );
      window.location.href = "/index.html";
      showAlert(
        content,
        "Please register or log in as a visitor to view this page.",
        "info"
      );
      return;
    }

    await renderVisitorViewContent(visitorId);
  } catch (error) {
    console.error("Error during visitor view initialization:", error);
    showAlert(
      content,
      "An unexpected error occurred during page setup.",
      "danger"
    );
  } finally {
    hideLoading();
  }
}
