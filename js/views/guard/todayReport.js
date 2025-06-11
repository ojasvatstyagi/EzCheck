// js/views/guard/todayReport.js
import {
  showLoading,
  hideLoading,
  showAlert,
  formatDateTime,
} from "../../utils/helpers.js";
import VisitorService from "../../../api/visitorApi.js";

function renderVisitRow(visit) {
  const visitorName = visit.visitor?.name || "N/A";
  const visitorCompany = visit.visitor?.company || "N/A";
  const statusClass =
    {
      Pending: "badge bg-warning text-dark",
      "Checked-In": "badge bg-success",
      Completed: "badge bg-info",
      Cancelled: "badge bg-danger",
    }[visit.status] || "badge bg-secondary";

  return `
    <tr>
      <td>${visitorName}</td>
      <td>${visitorCompany}</td>
      <td>${visit.purpose}</td>
      <td>${visit.host}</td>
      <td>${formatDateTime(visit.checkInTime)}</td>
      <td>${formatDateTime(visit.checkOutTime)}</td>
      <td><span class="${statusClass}">${visit.status}</span></td>
      <td>${visit.id}</td>
    </tr>
  `;
}

function renderVisitsList(visits, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (visits.length === 0) {
    container.innerHTML = `
      <div class="no-visits text-center py-4">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mt-4 text-gray-300">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
          <line x1="16" x2="16" y1="2" y2="6"></line>
          <line x1="8" x2="8" y1="2" y2="6"></line>
          <line x1="3" x2="21" y1="10" y2="10"></line>
        </svg>
        <p class="mt-2">No visitors in this category for today.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="table-responsive">
      <table class="table table-hover table-striped mt-3">
        <thead class="table-light">
          <tr>
            <th>Visitor Name</th>
            <th>Company</th>
            <th>Purpose</th>
            <th>Host</th>
            <th>Check-in Time</th>
            <th>Check-out Time</th>
            <th>Status</th>
            <th>Visit ID</th>
          </tr>
        </thead>
        <tbody>
          ${visits.map(renderVisitRow).join("")}
        </tbody>
      </table>
    </div>
  `;
}

export default async function initTodayVisitReport(onReturnCallback) {
  const content = document.getElementById("guard-dynamic-content");
  if (!content) return;

  content.innerHTML = `
    <div class="card shadow-sm rounded-4 mb-4">
      <div class="card-header bg-light text-dark rounded-top-4 d-flex justify-content-between align-items-center">
        <h2 class="mb-0">Today's Schedule</h2>
        <button id="refreshReportBtn" class="btn btn-light btn-sm rounded-pill px-3">
          <i class="fas fa-sync-alt me-2"></i>Refresh
        </button>
      </div>
      <div class="card-body p-4">
        <div class="input-group mb-3">
          <input type="text" class="form-control" placeholder="Search visitors by name, ID, or company..." id="visitor-search">
          <button class="btn btn-outline-secondary" type="button" id="clearSearchBtn">Clear</button>
        </div>
        <div class="nav nav-tabs" id="visits-tab" role="tablist">
          <button class="nav-link active text-primary-custom" id="expected-tab" data-bs-toggle="tab" data-bs-target="#tab-expected" type="button" role="tab" aria-controls="tab-expected" aria-selected="true">Expected</button>
          <button class="nav-link text-primary-custom" id="checked-in-tab" data-bs-toggle="tab" data-bs-target="#tab-checked-in" type="button" role="tab" aria-controls="tab-checked-in" aria-selected="false">Checked In</button>
          <button class="nav-link text-primary-custom" id="completed-tab" data-bs-toggle="tab" data-bs-target="#tab-completed" type="button" role="tab" aria-controls="tab-completed" aria-selected="false">Completed</button>
        </div>
        <div class="tab-content" id="visits-tabContent">
          <div class="tab-pane fade show active" id="tab-expected" role="tabpanel" aria-labelledby="expected-tab">
            <div id="expected-visits-list"></div>
          </div>
          <div class="tab-pane fade" id="tab-checked-in" role="tabpanel" aria-labelledby="checked-in-tab">
            <div id="checked-in-visits-list"></div>
          </div>
          <div class="tab-pane fade" id="tab-completed" role="tabpanel" aria-labelledby="completed-tab">
            <div id="completed-visits-list"></div>
          </div>
        </div>
        <button id="backToDashboardBtn" class="btn btn-outline-secondary mt-4"><i class="fas fa-arrow-left me-2"></i> Back to Dashboard</button>
      </div>
    </div>
  `;

  let allTodayVisits = [];
  async function fetchAndRenderVisits() {
    showLoading(content);
    try {
      allTodayVisits = await VisitorService.fetchTodayVisits();

      const expected = allTodayVisits.filter(
        (visit) => visit.status === "Pending"
      );
      const checkedIn = allTodayVisits.filter(
        (visit) => visit.status === "Checked-In"
      );
      const completed = allTodayVisits.filter(
        (visit) => visit.status === "Completed"
      );

      renderVisitsList(expected, "expected-visits-list");
      renderVisitsList(checkedIn, "checked-in-visits-list");
      renderVisitsList(completed, "completed-visits-list");
    } catch (error) {
      console.error("Error fetching today's visits:", error);
      showAlert(content, "Failed to load today's visitor schedule.", "danger");
      document.getElementById("expected-visits-list").innerHTML = "";
      document.getElementById("checked-in-visits-list").innerHTML = "";
      document.getElementById("completed-visits-list").innerHTML = "";
    } finally {
      hideLoading();
    }
  }

  fetchAndRenderVisits();

  // Event Listeners
  document
    .getElementById("refreshReportBtn")
    ?.addEventListener("click", fetchAndRenderVisits);
  document
    .getElementById("backToDashboardBtn")
    ?.addEventListener("click", () => {
      if (onReturnCallback) {
        onReturnCallback();
      }
    });

  const visitorSearchInput = document.getElementById("visitor-search");
  const clearSearchBtn = document.getElementById("clearSearchBtn");

  // Search functionality
  visitorSearchInput?.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredVisits = allTodayVisits.filter(
      (visit) =>
        visit.visitor?.name?.toLowerCase().includes(searchTerm) ||
        visit.visitor?.company?.toLowerCase().includes(searchTerm) ||
        visit.id?.toLowerCase().includes(searchTerm)
    );

    // Re-render filtered lists based on their original status
    renderVisitsList(
      filteredVisits.filter((v) => v.status === "Pending"),
      "expected-visits-list"
    );
    renderVisitsList(
      filteredVisits.filter((v) => v.status === "Checked-In"),
      "checked-in-visits-list"
    );
    renderVisitsList(
      filteredVisits.filter((v) => v.status === "Completed"),
      "completed-visits-list"
    );
  });

  clearSearchBtn?.addEventListener("click", () => {
    visitorSearchInput.value = "";
    fetchAndRenderVisits();
  });
}
