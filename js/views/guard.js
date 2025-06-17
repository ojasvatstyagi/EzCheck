// js/views/guard.js

import { showLoading, hideLoading, showAlert } from "../utils/helpers.js";
import { setupRegisterVisitorModal } from "./guard/registerVisitor.js";
import initTodayVisitReport from "./guard/todayReport.js";

function renderDashboardLayout() {
  return `
    <div class="container mt-4">
      <div class="card shadow rounded-4 p-4 mb-4 d-flex flex-row justify-content-between align-items-center">
        <p class="text-muted">You are responsible for verifying and checking in visitors at the gate.</p>
        <div class="col-md-4 text-md-end">
          <button id="addVisitorBtn" class="btn btn-light rounded-pill px-4">
            <i class="fas fa-plus me-2"></i>Add New Visit
          </button>
        </div>
      </div>
      <div id="guard-dynamic-content" class="mt-4"></div>
    </div>
  `;
}

let refreshTodayVisitReport = null;

export default async function initGuardView() {
  const content = document.getElementById("role-content");
  if (!content) return;

  content.innerHTML = renderDashboardLayout();
  setupGuardEventListeners();

  const dynamicContentArea = document.getElementById("guard-dynamic-content");
  if (dynamicContentArea) {
    showLoading(dynamicContentArea);
    try {
      refreshTodayVisitReport = await initTodayVisitReport(() => {
        if (refreshTodayVisitReport) {
          refreshTodayVisitReport();
        }
      });
    } catch (error) {
      showAlert(
        dynamicContentArea,
        "Failed to load today's visitor report.",
        "danger"
      );
    } finally {
      hideLoading();
    }
  }
}

async function handleGuardNavigation(viewName) {
  const dynamicContentArea = document.getElementById("guard-dynamic-content");
  if (!dynamicContentArea) return;

  // showLoading(dynamicContentArea); // Only show loading if actual content is changing/being fetched

  try {
    switch (viewName) {
      case "dashboard":
        if (refreshTodayVisitReport) {
          refreshTodayVisitReport();
        }
        break;
      case "add-visitor":
        setupRegisterVisitorModal(
          (visitData) => {
            if (refreshTodayVisitReport) {
              refreshTodayVisitReport();
            }
          },
          { forceWalkIn: true }
        );
        break;
      default:
        console.warn("Unknown guard view:", viewName);
        if (refreshTodayVisitReport) {
          refreshTodayVisitReport(); // Stay on dashboard and refresh
        }
        break;
    }
  } catch (error) {
    console.error(`Error loading ${viewName} view:`, error);
    showAlert(dynamicContentArea, `Failed to load ${viewName} view.`, "danger");
  } finally {
    hideLoading();
  }
}

function setupGuardEventListeners() {
  document.getElementById("addVisitorBtn")?.addEventListener("click", () => {
    handleGuardNavigation("add-visitor");
  });
}
