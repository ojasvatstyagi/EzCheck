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
    // Fetch visitor data from API
    const visitorData = await fetchVisitorData();

    // Render the visitor dashboard
    content.innerHTML = `
    <div class="row">
        <div class="col-md-4 mb-4">
          <!-- Profile Section -->
          <div id="profile-section"></div>
        </div>
        <div class="col-md-8 mb-4">
          <!-- Current Pass Section -->
          <div id="current-pass-section"></div>
        </div>
      </div>
      <!-- Visit History -->
      <div id="visit-history-section"></div>
    
      <!-- Modals -->
      <div id="modals-container"></div>
    `;

    // Render profile and current pass sections
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
    if (visitorData.currentVisit?.status === "Approved") {
      await generateQRCode(
        "visitQrCode",
        `VISITOR:${visitorData.id}|VISIT:${visitorData.currentVisit.id}`
      );
    }

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
