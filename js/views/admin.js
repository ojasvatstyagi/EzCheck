// js/views/admin.js
import initVisitorManagement from "./admin/visitorManagement.js";
import initBlacklistManagement from "./admin/blacklistManagement.js";
import initUserManagement from "./admin/userManagement.js";
import VisitorService from "../../api/visitorApi.js";
import { showLoading, hideLoading, showAlert } from "../utils/helpers.js";
import { setupRegisterVisitorModal } from "./guard/registerVisitor.js";

async function initDashboard() {
  const content = document.getElementById("role-content");
  showLoading(content);

  try {
    const [visitors, blacklist, visits] = await Promise.all([
      VisitorService.fetchVisitors(),
      VisitorService.fetchBlacklist(),
      VisitorService.fetchAllVisits(),
    ]);

    const currentlyInsideVisits = visits.filter(
      (visit) => visit.status === "Checked-In" && !visit.checkOutTime
    );
    const uniqueVisitorsInsideIds = new Set(
      currentlyInsideVisits.map((visit) => visit.visitorId)
    );
    const currentVisitorsCount = visitors.filter((v) =>
      uniqueVisitorsInsideIds.has(v.id)
    ).length;

    content.innerHTML = `
      <div class="card shadow-sm mb-4">
        <div class="card-body d-flex flex-row justify-content-between">
          <div class="d-flex flex-column">
            <h4 class="mb-0-custom">Admin Dashboard</h4>
            <p class="text-muted mb-0">Manage visitors, blacklist, users, and generate reports</p>
          </div>
          <div class="col-md-4 text-md-end">
            <button id="addVisitorBtn" class="btn btn-light rounded-pill px-4">
              <i class="fas fa-plus me-2"></i>Add New Visit
            </button>
          </div>
        </div>
      </div>

      <div class="card shadow rounded-4 p-4 mb-4 d-flex flex-row justify-content-between">
        <div class="col-md-8">
          <h2 class="mb-3"><i class="fas fa-file-alt me-2"></i>Reporting</h2>
          <p class="mb-0 text-muted">Click the button above to export visitor data.</p>
        </div>
        <div class="col-md-4 text-md-end">
          <button class="btn btn-light rounded-pill px-4" id="exportHostReportBtn">
            <i class="fas fa-download me-2"></i>Export Report
          </button>
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
                  <h3 class="text-primary-custom" id="totalVisitors">${visitors.length}</h3>
                  <small class="text-dark-custom">Total Visitors</small>
                </div>
                <div class="col-4">
                  <h3 class="text-success" id="currentVisitors">${currentVisitorsCount}</h3>
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

        <div class="col-md-6 mb-4">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-gray-custom text-dark">
              <h5 class="mb-0-custom">Quick Actions</h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button class="btn btn-outline-primary-custom" id="viewAllVisitorsBtn">
                  <i class="fas fa-users me-2"></i> View All Visitors
                </button>
                <button class="btn btn-outline-info" id="manageUsersBtn">
                  <i class="fas fa-user-cog me-2"></i> Manage Users
                </button>
                <button class="btn btn-outline-danger" id="blacklistEntryBtn">
                  <i class="fas fa-ban me-2"></i>Blacklist Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="modals-container"></div>
    `;

    // Event listeners for quick actions
    document
      .getElementById("viewAllVisitorsBtn")
      .addEventListener("click", initVisitorManagement);

    document
      .getElementById("manageUsersBtn")
      .addEventListener("click", initUserManagement);

    document
      .getElementById("blacklistEntryBtn")
      .addEventListener("click", initBlacklistManagement);

    document
      .getElementById("exportHostReportBtn")
      ?.addEventListener("click", async () => {
        VisitorService.exportAdminDataToJson();
      });

    document.getElementById("addVisitorBtn")?.addEventListener("click", () => {
      setupRegisterVisitorModal((newVisitData) => {
        console.log("New visitor registered/visit created:", newVisitData);
        showAlert(document.body, "Visitor registered successfully!", "success");
        initDashboard();
      });
    });
  } catch (error) {
    console.error("Admin Dashboard load error:", error);
    showAlert(
      content,
      "Failed to load admin dashboard data. Please try again.",
      "danger"
    );
  } finally {
    hideLoading();
  }
}

export default function initAdminDashboard() {
  initDashboard();
}
