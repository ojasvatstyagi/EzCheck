// js/views/host.js

import VisitorService from "../../api/visitorApi.js";
import {
  getCurrentUser,
  showLoading,
  hideLoading,
  showAlert,
} from "../utils/helpers.js";
import { setupRegisterVisitorModal } from "./guard/registerVisitor.js";
import { renderPendingRequestsSection } from "./host/pendingRequestsSection.js";
import { renderTodaysVisitsSection } from "./host/todaysVisitsSection.js";
import { renderUpcomingVisitsSection } from "./host/upcomingVisitsSection.js";
import { renderHostVisitHistorySection } from "./host/hostVisitHistorySection.js";
export default async function loadHostView() {
  const content = document.getElementById("role-content");
  if (!content) {
    console.error("Role content area not found!");
    return;
  }

  showLoading(content);

  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "host") {
    showAlert(
      document.body,
      "Access Denied. Please login as a Host.",
      "danger"
    );
    hideLoading();
    window.location.hash = "#/login";
    return;
  }

  const hostName = currentUser.name;

  content.innerHTML = `
        <div class="app-layout">
            <main class="main-content">
                <div id="section-dashboard" class="section-content">
                    <div class="host-dashboard">

                        <div class="container mt-4">
                          <div class="card shadow rounded-4 p-0 mb-4">
                            <div class="card-header text-dark rounded-top-4 d-flex align-items-center"
                                style="background: linear-gradient(90deg, #ffc300 0%, #ff9100 100%);">
                              <i class="fas fa-user fa-2x me-3 text-white"></i>
                              <h4 class="mb-0 fw-bold flex-grow-1 text-white">Manage Your Visitors</h4>
                              <button id="hostRegisterVisitorBtn" class="btn btn-light rounded-pill px-4 py-2 shadow-sm ms-2">
                                <i class="fas fa-plus me-2"></i>Add New Visit
                              </button>
                              <button id="exportHostReportBtn" class="btn btn-light rounded-pill px-4 py-2 shadow-sm ms-2">
                                <i class="fas fa-download me-2"></i>Export Report
                              </button>
                            </div>
                            <div class="card-body">
                              <p class="text-muted mb-2">
                                Manage your visitors, check your upcoming visits, and generate detailed reports. 
                                Stay organized and enhance security with streamlined visitor registration and reporting features.
                              </p>
                            </div>
                          </div>
                        </div>
            
                        <div class="card shadow-lg mb-4">
                          <div class="card-body">
                          <ul class="nav nav-tabs" id="hostDashboardTabs" role="tablist">
                            <li class="nav-item" role="presentation">
                              <button class="nav-link active text-primary-custom" id="pending-tab" data-bs-toggle="tab" data-bs-target="#pending" type="button" role="tab">
                                Pending Requests
                                <span class="badge bg-danger ms-2" id="pending-badge-count">0</span>
                              </button>
                            </li>
                            <li class="nav-item" role="presentation">
                              <button class="nav-link text-primary-custom" id="today-tab" data-bs-toggle="tab" data-bs-target="#today" type="button" role="tab">
                                Today's Visits
                                <span class="badge bg-primary ms-2" id="today-badge-count">0</span>
                              </button>
                            </li>
                            <li class="nav-item" role="presentation">
                              <button class="nav-link text-primary-custom" id="upcoming-tab" data-bs-toggle="tab" data-bs-target="#upcoming" type="button" role="tab">
                                Upcoming Visits
                                <span class="badge bg-warning text-dark ms-2" id="upcoming-badge-count">0</span>
                              </button>
                            </li>
                            <li class="nav-item" role="presentation">
                              <button class="nav-link text-primary-custom" id="history-tab" data-bs-toggle="tab" data-bs-target="#history" type="button" role="tab">
                                Visit History
                              </button>
                            </li>
                          </ul>
                          
                          <div class="tab-content p-3 border border-top-0 rounded-bottom" id="hostDashboardTabsContent">
                            <div class="tab-pane fade show active" id="pending" role="tabpanel">
                              <div id="pending-requests-container"></div>
                            </div>
                            <div class="tab-pane fade" id="today" role="tabpanel">
                              <div id="today-visits-container"></div>
                            </div>
                            <div class="tab-pane fade" id="upcoming" role="tabpanel">
                              <div id="upcoming-visits-container"></div>
                            </div>
                            <div class="tab-pane fade" id="history" role="tabpanel">
                              <div id="host-visit-history-container"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
            </main>
        </div>
    `;

  document
    .getElementById("hostRegisterVisitorBtn")
    ?.addEventListener("click", () => {
      setupRegisterVisitorModal(
        (newVisitData) => {
          console.log("New visitor registered:", newVisitData);
          showAlert(
            document.body,
            "Visitor registered successfully!",
            "success"
          );
          loadHostDashboardData(hostName);
        },
        {
          prefillHostName: hostName,
          isHostRegistering: true,
        }
      );
    });

  document
    .getElementById("exportHostReportBtn")
    ?.addEventListener("click", async () => {
      VisitorService.exportHostVisitsToJson(hostName);
    });

  await loadHostDashboardData(hostName);

  hideLoading();
}

async function loadHostDashboardData(name) {
  try {
    const response = await VisitorService.fetchVisitsByHost(name);
    const allHostVisits = response.visits || [];

    // Filter and count different types of visits
    const pendingRequests = allHostVisits.filter(
      (visit) => visit.status === "Pending"
    );
    document.getElementById("pending-badge-count").textContent =
      pendingRequests.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysVisits = allHostVisits.filter((visit) => {
      const visitDate = new Date(visit.visitDate);
      return (
        visitDate.toDateString() === today.toDateString() &&
        (visit.status === "Approved" || visit.status === "Checked-In")
      );
    });
    document.getElementById("today-badge-count").textContent =
      todaysVisits.length;

    const upcomingVisits = allHostVisits.filter((visit) => {
      const visitDate = new Date(visit.visitDate);
      return (
        visitDate > today &&
        visit.status !== "Completed" &&
        visit.status !== "Cancelled" &&
        visit.status !== "Declined"
      );
    });
    document.getElementById("upcoming-badge-count").textContent =
      upcomingVisits.length;

    const hostVisitHistory = allHostVisits.filter((visit) => {
      const visitDate = new Date(visit.visitDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      return (
        visit.status === "Completed" ||
        visit.status === "Declined" ||
        visit.status === "Cancelled" ||
        (new Date(visit.visitDate).getTime() < now.getTime() &&
          visit.status !== "Pending" &&
          visit.status !== "Approved" &&
          visit.status !== "Checked-In")
      );
    });

    // Render all sections
    renderPendingRequestsSection(pendingRequests, name, loadHostDashboardData);
    renderTodaysVisitsSection(todaysVisits, name, loadHostDashboardData);
    renderUpcomingVisitsSection(upcomingVisits, name, loadHostDashboardData);
    renderHostVisitHistorySection(hostVisitHistory, name);
  } catch (error) {
    console.error("Error loading host dashboard data:", error);
    showAlert(
      document.body,
      "Failed to load host dashboard: " + error.message,
      "danger"
    );
    const pendingContainer = document.getElementById(
      "pending-requests-container"
    );
    if (pendingContainer) {
      pendingContainer.innerHTML = `
        <div class="text-center text-danger p-4">
          <p>Error loading requests. Please try again.</p>
        </div>
      `;
    }
  }
}
