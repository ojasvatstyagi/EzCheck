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
      <div class="card shadow rounded-4 p-0 mb-4">
        <div class="card-header d-flex align-items-center rounded-top-4"
            style="background: linear-gradient(90deg, #ffc300 0%, #ff9100 100%);">
          <i class="fas fa-cogs fa-2x me-3 text-white"></i>
          <h4 class="mb-0 fw-bold flex-grow-1 text-white">Admin Dashboard</h4>
          <button id="addVisitorBtn" class="btn btn-light rounded-pill px-4 py-2 shadow-sm ms-2">
            <i class="fas fa-plus me-2"></i>Add New Visit
          </button>
          <button id="exportHostReportBtn" class="btn btn-light rounded-pill px-4 py-2 shadow-sm ms-2">
            <i class="fas fa-download me-2"></i>Export Report
          </button>
        </div>
        <div class="card-body">
          <p class="text-muted mb-2">
            Manage visitors, blacklist, users, and generate comprehensive reports with ease. Streamline your admin tasks and keep track of all essential activities from one place.
          </p>
        </div>
      </div>

      <div class="row g-4">
        <!-- Visitor's Stats Card -->
        <div class="col-md-6">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-light d-flex align-items-center py-2">
              <i class="fa-solid fa-chart-bar me-2 text-dark"></i>
              <h5 class="mb-0 fw-semibold">Visitor's Stats</h5>
            </div>
            <div class="card-body">
              <div class="row text-center">
                <div class="col-4 border-end">
                  <div class="mb-2">
                    <span class="badge bg-primary bg-opacity-10 p-3 rounded-circle">
                      <i class="fa-solid fa-users text-primary"></i>
                    </span>
                  </div>
                  <h3 class="text-primary mb-0" id="totalVisitors">${visitors.length}</h3>
                  <small class="text-muted">Total Visitors</small>
                </div>
                <div class="col-4 border-end">
                  <div class="mb-2">
                    <span class="badge bg-success bg-opacity-10 p-3 rounded-circle">
                      <i class="fa-solid fa-door-open text-success"></i>
                    </span>
                  </div>
                  <h3 class="text-success mb-0" id="currentVisitors">${currentVisitorsCount}</h3>
                  <small class="text-muted">Currently Inside</small>
                </div>
                <div class="col-4">
                  <div class="mb-2">
                    <span class="badge bg-danger bg-opacity-10 p-3 rounded-circle">
                      <i class="fa-solid fa-user-slash text-danger"></i>
                    </span>
                  </div>
                  <h3 class="text-danger mb-0" id="blacklisted">${blacklist.length}</h3>
                  <small class="text-muted">Blacklisted</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions Card -->
        <div class="col-md-6">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-light d-flex align-items-center py-2">
              <i class="fa-solid fa-bolt me-2 text-dark"></i>
              <h5 class="mb-0 fw-semibold">Quick Actions</h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-3">
                <button class="btn btn-outline-primary d-flex align-items-center justify-content-center" id="viewAllVisitorsBtn">
                  <i class="fa-solid fa-users me-2"></i> View All Visitors
                </button>
                <button class="btn btn-outline-info d-flex align-items-center justify-content-center" id="manageUsersBtn">
                  <i class="fa-solid fa-user-gear me-2"></i> Manage Users
                </button>
                <button class="btn btn-outline-danger d-flex align-items-center justify-content-center" id="blacklistEntryBtn">
                  <i class="fa-solid fa-circle-xmark me-2"></i> Blacklist Entry
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
