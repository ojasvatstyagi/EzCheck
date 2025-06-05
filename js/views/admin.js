import initVisitorManagement from "./admin/visitorManagement.js";
import initBlacklistManagement from "./admin/blacklistManagement.js";
import initReporting from "./admin/reporting.js";
import { fetchVisitors, fetchBlacklist } from "../../api/visitorApi.js";
import { showLoading, hideLoading, showAlert } from "../utils/helpers.js";

async function initDashboard() {
  const content = document.getElementById("role-content");
  showLoading(content);

  try {
    const [visitors, blacklist] = await Promise.all([
      fetchVisitors(),
      fetchBlacklist(),
    ]);

    // Render dashboard
    content.innerHTML = `
  <div class="row mb-4">
    <div class="col-12">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <h4 class="mb-0-custom">Admin Dashboard</h4>
            <p class="text-muted"> Manage visitors, blacklist, and generate analytics</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row">
    <!-- Stats Overview -->
    <div class="col-md-6 mb-4">
      <div class="card shadow-sm h-100">
        <div class="card-header bg-primary-custom text-light-custom">
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
                visitors.filter((v) => !v.checkOutTime).length
              }</h3>
              <small class="text-dark-custom">Currently Inside</small>
            </div>
            <div class="col-4">
              <h3 class="text-danger" id="blacklisted">${blacklist.length}</h3>
              <small class="text-dark-custom">Blacklisted</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="col-md-6 mb-4">
      <div class="card shadow-sm h-100">
        <div class="card-header bg-primary-custom text-light-custom">
          <h5 class="mb-0-custom">Quick Actions</h5>
        </div>
        <div class="card-body">
          <div class="d-grid gap-2">
            <button class="btn btn-custom text-start" id="addBlacklistBtn" onclick="initBlacklistManagement()">
              <i class="fas fa-ban me-2"></i>Blacklist Entry
            </button>
            <button class="btn btn-outline-secondary text-start" id="viewAllVisitorsBtn" onclick="initVisitorManagement()">
              <i class="fas fa-users me-2"></i> View All Visitors
            </button>
            <button class="btn btn-outline-success text-start" id="generateReportBtn" onclick="initReporting()">
              <i class="fas fa-chart-pie me-2"></i> Generate Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="modals-container"></div>
`;
    // Add event listeners
    document
      .getElementById("addBlacklistBtn")
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
  // Load just the dashboard by default
  initDashboard();

  // Global Nav Event Listeners
  document
    .getElementById("viewAllVisitorsBtn")
    ?.addEventListener("click", initVisitorManagement);
  document
    .getElementById("addBlacklistBtn")
    ?.addEventListener("click", initBlacklistManagement);
  document
    .getElementById("generateReportBtn")
    ?.addEventListener("click", initReporting);
}
