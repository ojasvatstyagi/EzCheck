// js/views/guard.js

import { showLoading, hideLoading, showAlert } from "../utils/helpers.js";
import VisitorService from "../../api/visitorApi.js";
import initAddVisitorView from "./guard/addVisitor.js";
import initTodayVisitReport from "./guard/todayReport.js";

// Function to render the main dashboard layout
function renderDashboardLayout() {
  return `
    <div class="container mt-4">
      <div class="card shadow rounded-4 p-4 mb-4 d-flex flex-row justify-content-between align-items-center">
        <p class="text-muted">You are responsible for verifying and checking in visitors at the gate.</p>
        <div class="col-md-4 text-md-end">
          <button id="addVisitorBtn" class="btn btn-light rounded-pill px-4">
            <i class="fas fa-plus me-2"></i>Add New Visitor
          </button>
        </div>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-md-6">
          <div class="card border-dark rounded-4 p-3 h-100">
            <h5 class="mb-2">Check-In / Check-Out</h5>
            <p>Scan QR or manually enter Visit ID to log entry/exit.</p>
            <button id="startCheckInOutBtn" class="btn btn-outline-primary-custom mt-2">Start Check-In/Out</button>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card border-dark rounded-4 p-3 h-100">
            <h5 class="mb-2">Today's Visitors</h5>
            <p>View the list of visitors expected, checked-in, or completed today.</p>
            <button id="viewVisitorsBtn" class="btn btn-outline-secondary mt-2">View List</button>
          </div>
        </div>
      </div>

      <div id="guard-dynamic-content" class="mt-4"></div>
    </div>
  `;
}

// Function to render the manual check-in/out scanner section
function renderScannerSection() {
  return `
    <div class="card p-4 border-dark rounded-4 mb-4">
      <h3 class="mb-4">Visit Check-In / Check-Out</h3>
      <div class="scanner-container mx-auto max-w-md text-center">
        <div class="scanner-instructions mt-3 mb-4">
          <h4 class="scanner-title">Manual Visit ID Entry</h4>
          <p class="scanner-help">Enter the Visit ID to update entry or exit time.</p>
        </div>
        <form id="manual-entry-form" class="manual-entry-form mb-4">
          <div class="input-group">
            <input type="text" id="visit-code" class="form-control form-control-lg" placeholder="Enter Visit ID (e.g., VIS123)" required>
            <button type="submit" class="btn btn-outline-primary-custom">Process</button>
          </div>
        </form>
        <div id="check-in-out-status" class="mt-3"></div>
        <button id="backToDashboardBtn" class="btn btn-outline-secondary mt-4"><i class="fas fa-arrow-left me-2"></i> Back to Dashboard</button>
      </div>
    </div>
  `;
}

// Main function to manage the guard view
export default async function initGuardView() {
  const content = document.getElementById("role-content");
  if (!content) return;

  // Render the initial dashboard layout
  content.innerHTML = renderDashboardLayout();
  setupGuardEventListeners();
}

// Function to handle dynamic content loading and event listeners
async function handleGuardNavigation(viewName) {
  const dynamicContentArea = document.getElementById("guard-dynamic-content");
  if (!dynamicContentArea) return;

  showLoading(dynamicContentArea);

  try {
    dynamicContentArea.innerHTML = ""; // Clear previous content

    switch (viewName) {
      case "dashboard":
        // Re-render the whole layout and re-setup listeners
        document.getElementById("role-content").innerHTML =
          renderDashboardLayout();
        setupGuardEventListeners();
        break;
      case "add-visitor":
        // Render the add visitor form into the dynamic area
        initAddVisitorView(async (message, type) => {
          await handleGuardNavigation("dashboard");
          showAlert(document.body, message, type);
        });
        break;
      case "check-in-out":
        dynamicContentArea.innerHTML = renderScannerSection();
        setupCheckInOutListener();
        document
          .getElementById("backToDashboardBtn")
          .addEventListener("click", () => handleGuardNavigation("dashboard"));
        break;
      case "today-visitors":
        initTodayVisitReport(async () => {
          await handleGuardNavigation("dashboard");
        });
        break;
      default:
        console.warn("Unknown guard view:", viewName);
        break;
    }
  } catch (error) {
    console.error(`Error loading ${viewName} view:`, error);
    showAlert(dynamicContentArea, `Failed to load ${viewName} view.`, "danger");
  } finally {
    hideLoading();
  }
}

// Centralized event listener setup for main dashboard buttons
function setupGuardEventListeners() {
  document.getElementById("addVisitorBtn")?.addEventListener("click", () => {
    handleGuardNavigation("add-visitor");
  });

  document
    .getElementById("startCheckInOutBtn")
    ?.addEventListener("click", () => {
      handleGuardNavigation("check-in-out");
    });

  document.getElementById("viewVisitorsBtn")?.addEventListener("click", () => {
    handleGuardNavigation("today-visitors");
  });
}

// --- Check-in/Out Logic for Visit ID ---
async function setupCheckInOutListener() {
  const manualEntryForm = document.getElementById("manual-entry-form");
  const checkInOutStatus = document.getElementById("check-in-out-status");

  if (manualEntryForm) {
    manualEntryForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const visitCodeInput = document.getElementById("visit-code");
      const visitId = visitCodeInput.value.trim();

      if (!visitId) {
        showAlert(checkInOutStatus, "Please enter a Visit ID.", "warning");
        return;
      }

      showLoading(checkInOutStatus);
      checkInOutStatus.innerHTML = ""; // Clear previous status

      try {
        const response = await VisitorService.checkInOutVisit(visitId);

        if (response.success) {
          showAlert(checkInOutStatus, response.message, "success");
          if (response.visitorName && response.visitStatus) {
            checkInOutStatus.innerHTML += `<p class="mt-2"><strong>${response.visitorName}</strong>: Visit is now <strong>${response.visitStatus}</strong>.</p>`;
          }
          visitCodeInput.value = "";
        } else {
          showAlert(
            checkInOutStatus,
            response.message || "Failed to process visit ID.",
            "danger"
          );
        }
      } catch (error) {
        console.error("Error processing visit ID:", error);
        showAlert(
          checkInOutStatus,
          "An error occurred: " + error.message,
          "danger"
        );
      } finally {
        hideLoading();
      }
    });
  }
}
