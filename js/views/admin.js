// js/views/admin.js
import initVisitorManagement from "./admin/visitorManagement.js";
import initBlacklistManagement from "./admin/blacklistManagement.js";
import initReporting from "./admin/reporting.js";
import VisitorService from "../../api/visitorApi.js";
import { showLoading, hideLoading, showAlert } from "../utils/helpers.js";

async function initDashboard() {
  const content = document.getElementById("role-content");
  showLoading(content);

  try {
    const [visitors, blacklist] = await Promise.all([
      VisitorService.fetchVisitors(),
      VisitorService.fetchBlacklist(),
    ]);

    const currentVisitors = visitors.filter((v) => !v.checkOutTime);

    // Render dashboard HTML
    content.innerHTML = `
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <h4 class="mb-0-custom">Admin Dashboard</h4>
                <p class="text-muted mb-0">Manage visitors, blacklist, and generate reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-gray-custom text-dark-custom">
              <h5 class="mb-0-custom">Visitor's Stats</h5>
            </div>
            <div class="card-body">
              <div class="row text-center">
                <div class="col-4">
                  <h3 class="text-primary-custom" id="totalVisitors">${
                    visitors.length
                  }</h3>
                  <small class="text-dark-custom">Total Visitors</small>
                </div>
                <div class="col-4">
                  <h3 class="text-success" id="currentVisitors">${
                    currentVisitors.length // Use the calculated currentVisitors
                  }</h3>
                  <small class="text-dark-custom">Currently Inside</small>
                </div>
                <div class="col-4">
                  <h3 class="text-danger" id="blacklisted">${
                    blacklist.length
                  }</h3>
                  <small class="text-dark-custom">Blacklisted</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-gray-custom text-dark">
              <h5 class="mb-0-custom">Quick Actions</h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button class="btn btn-outline-primary-custom text-start" id="blacklistEntryBtn">
                  <i class="fas fa-ban me-2"></i>Blacklist Entry
                </button>
                <button class="btn btn-outline-secondary text-start" id="viewAllVisitorsBtn">
                  <i class="fas fa-users me-2"></i> View All Visitors
                </button>
                <button class="btn btn-outline-success text-start" id="generateReportBtn">
                  <i class="fas fa-chart-pie me-2"></i> Generate Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="modals-container"></div>
    `;

    // Attach event listeners the HTML elements are rendered
    document
      .getElementById("blacklistEntryBtn") // Renamed from addBlacklistBtn for clarity, but you can keep original
      .addEventListener("click", initBlacklistManagement);
    document
      .getElementById("viewAllVisitorsBtn")
      .addEventListener("click", initVisitorManagement);
    document
      .getElementById("generateReportBtn")
      .addEventListener("click", initReporting);
  } catch (error) {
    console.error("Dashboard load error:", error);
    showAlert(content, "Failed to load dashboard", "danger");
  } finally {
    hideLoading();
  }
}

export default function initAdminDashboard() {
  initDashboard();
}
