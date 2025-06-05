// js/views/visitor.js
import { fetchVisitorData } from "../../api/visitorApi.js";

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

export default async function initVisitorView() {
  const content = document.getElementById("role-content");
  if (!content) return;

  showLoading(content);

  try {
    const visitorId = localStorage.getItem("visitorId");
    if (!visitorId) throw new Error("No visitor ID found");

    const visitorData = await fetchVisitorData(visitorId);

    content.innerHTML = `
  <div class="container mt-4">
    <div class="row align-items-center">
      <!-- Profile Section -->
      <div id="profile-section" class="col-md-5 mb-3"></div>
      <!-- Current Pass Section-->
      <div id="current-pass-section" class="col-md-7 mb-3"></div>
    </div>
    <div class="row">
      <div class="col-12">
        <button id="requestVisitBtn" class="btn btn-outline-primary-custom mt-3">Request New Visit</button>
      </div>
    </div>
    <!-- Visit History -->
    <div id="visit-history-section" class="mb-3"></div>
    <!-- Modals -->
    <div id="modals-container"></div>
  </div>
`;

    // Render profile, visit history and current pass sections
    document.getElementById("profile-section").innerHTML = `
      ${initProfileView(visitorData)}
    `;
    document.getElementById("current-pass-section").innerHTML = `
      ${renderVisitStatus(visitorData)}
    `;
    document.getElementById("visit-history-section").innerHTML = `
      ${renderVisitHistory(visitorData)}
    `;

    // Generate QR code if approved visit exists
    // if (visitorData.currentVisit?.status === "Approved") {
    //   await generateQRCode(
    //     "visitQrCode",
    //     `VISITOR:${visitorData.id}|VISIT:${visitorData.currentVisit.id}`
    //   );
    // }

    // Setup event listeners
    setupEventListeners(visitorData.id);
  } catch (error) {
    console.error("Visitor view error:", error);
    showAlert(content, "Failed to load visitor data", "danger");
  } finally {
    hideLoading();
  }
}

function setupEventListeners(visitorId) {
  // Callback function to refresh the view after successful operations
  const refreshView = () => {
    initVisitorView();
  };

  // Setup all event listeners with their respective modules
  setupVisitRequestListener(visitorId, refreshView);
  setupVisitCancelListener(visitorId, refreshView);
  setupIdUploadListener(visitorId, refreshView);
  setupPhotoUploadListener(visitorId, refreshView);
}
