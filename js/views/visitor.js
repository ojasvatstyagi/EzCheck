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
    console.log(visitorData);

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

    // If visitor is blocked, show only the "Access Denied" message
    if (visitorData.isBlocked) {
      content.innerHTML = `
        <div class="container mt-4 text-center">
          <div class="alert alert-danger" role="alert">
            <i class="fas fa-ban fa-3x mb-3"></i>
            <h4 class="alert-heading">Access Denied!</h4>
            <p>Your account is blocked. You cannot access any features.</p>
            <hr>
            <p class="mb-0">Please contact the administration for assistance.</p>
          </div>
        </div>
      `;
      hideLoading();
      return;
    }

    // Main structure - Updated layout
    content.innerHTML = `
      <div class="container mt-4">
        <div class="row">
          <!-- Profile Section - Full width on mobile, 4 columns on desktop -->
          <div class="col-12 col-lg-4 mb-4">
            <div class="card shadow-sm h-100">
              <div id="profile-section"></div>
            </div>
          </div>
          
          <!-- Current Pass Section - Full width on mobile, 8 columns on desktop -->
          <div class="col-12 col-lg-8 mb-4">
            <div class="card shadow-sm h-100">
              <div id="current-pass-section"></div>
            </div>
          </div>
        </div>
        
        <!-- Visit History Section - Full width -->
        <div class="row">
          <div class="col-12 mb-4">
              <div id="visit-history-section"></div>
          </div>
        </div>
        
        <div id="modals-container"></div>
      </div>
    `;

    // Render profile section
    document.getElementById("profile-section").innerHTML = `
      ${initProfileView(visitorData, editingMode)}
    `;

    // Render current pass section
    document.getElementById("current-pass-section").innerHTML = `
      ${renderVisitStatus(visitorData)}
    `;

    // Generate QR codes for approved visits
    const activeVisits = (visitorData.visitHistory || []).filter(
      (visit) => visit.status === "Approved" || visit.status === "Pending"
    );

    for (const visit of activeVisits) {
      if (visit.status === "Approved") {
        await generateQRCode(
          `visitQrCode-${visit.id}`,
          `VISITOR ID:${visitorData.id}|NAME:${visitorData.name}|VISIT ID:${visit.id}`
        );
      }
    }

    // Render visit history
    document.getElementById("visit-history-section").innerHTML = `
      ${renderVisitHistory(visitorData)}
    `;

    // Setup all event listeners
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
