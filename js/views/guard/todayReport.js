// js/views/guard/todayReport.js

import {
  showLoading,
  hideLoading,
  showAlert,
  formatDateTime,
  getStatusColor,
} from "../../utils/helpers.js";
import VisitorService from "../../../api/visitorApi.js";

async function handleCheckInOutAction(
  visitId,
  action, // 'checkIn' or 'checkOut'
  statusElementId,
  fetchAndRenderVisitsCallback // Callback to refresh the entire list after action
) {
  const statusElement = document.getElementById(statusElementId);
  if (!statusElement) return;

  showLoading(statusElement);
  statusElement.innerHTML = ""; // Clear previous status

  try {
    const response = await VisitorService.checkInOutVisit(visitId);

    if (response.success) {
      showAlert(statusElement, response.message, "success");
      if (response.visitorName && response.visitStatus) {
        statusElement.innerHTML += `<p class="mt-2"><strong>${response.visitorName}</strong>: Visit is now <strong>${response.visitStatus}</strong>.</p>`;
      }
      // Re-fetch and render all visits to update the lists
      await fetchAndRenderVisitsCallback();
    } else {
      showAlert(
        statusElement,
        response.message || `Failed to ${action} visit.`,
        "danger"
      );
    }
  } catch (error) {
    console.error(`Error during ${action} for visit ID ${visitId}:`, error);
    showAlert(
      statusElement,
      `An error occurred during ${action}: ` + error.message,
      "danger"
    );
  } finally {
    hideLoading();
    setTimeout(() => {
      statusElement.innerHTML = "";
    }, 5000);
  }
}

// Renders a single row in the visits table
function renderVisitRow(visit, fetchAndRenderVisitsCallback) {
  const visitorName = visit.visitor?.name || "N/A";
  const visitorCompany = visit.visitor?.company || "N/A";

  let actionButton = "";
  let statusDisplay = `<span class="badge ${getStatusColor(visit.status)}">${
    visit.status
  }</span>`;

  // Determine which button to show based on status
  if (visit.status === "Pending" || visit.status === "Approved") {
    actionButton = `
      <button class="btn btn-sm btn-success check-in-btn" data-visit-id="${visit.id}" data-action="checkIn">
        <i class="fas fa-sign-in-alt me-1"></i> Check-In
      </button>
    `;
  } else if (visit.status === "Checked-In") {
    actionButton = `
      <button class="btn btn-sm btn-warning check-out-btn" data-visit-id="${visit.id}" data-action="checkOut">
        <i class="fas fa-sign-out-alt me-1"></i> Check-Out
      </button>
    `;
  } else if (visit.status === "Completed" || visit.status === "Cancelled") {
    actionButton = `<span class="text-muted fst-italic">N/A</span>`; // No action needed
  }

  return `
    <tr>
      <td>${visitorName}</td>
      <td>${visitorCompany}</td>
      <td>${visit.purpose}</td>
      <td>${visit.host}</td>
      <td>${formatDateTime(visit.checkInTime)}</td>
      <td>${formatDateTime(visit.checkOutTime)}</td>
      <td>${statusDisplay}</td>
      <td>${visit.id}</td>
      <td>${actionButton}</td>
    </tr>
  `;
}

// Renders the full list of visits into the specified container
function renderVisitsList(visits, containerId, fetchAndRenderVisitsCallback) {
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${visits
            .map((visit) => renderVisitRow(visit, fetchAndRenderVisitsCallback))
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

// Main function to initialize and manage the Today's Visit Report view
export default async function initTodayVisitReport(onReturnCallback) {
  const content = document.getElementById("guard-dynamic-content"); // This is the dynamic area in guard.js
  if (!content) {
    console.error("Guard dynamic content area not found.");
    return;
  }

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
        <div id="check-in-out-status-message" class="mb-3"></div>
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
      </div>
    </div>
  `;

  let allTodayVisits = [];
  const checkInOutStatusMessageAreaId = "check-in-out-status-message";

  async function fetchAndRenderVisits() {
    showLoading(content);
    try {
      allTodayVisits = await VisitorService.fetchTodayVisits();

      const expected = allTodayVisits.filter(
        (visit) => visit.status === "Pending" || visit.status === "Approved"
      );
      const checkedIn = allTodayVisits.filter(
        (visit) => visit.status === "Checked-In"
      );
      const completed = allTodayVisits.filter(
        (visit) => visit.status === "Completed" || visit.status === "Cancelled"
      );

      renderVisitsList(expected, "expected-visits-list", fetchAndRenderVisits);
      renderVisitsList(
        checkedIn,
        "checked-in-visits-list",
        fetchAndRenderVisits
      );
      renderVisitsList(
        completed,
        "completed-visits-list",
        fetchAndRenderVisits
      );

      setupVisitActionListeners(fetchAndRenderVisits);
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

  document
    .getElementById("refreshReportBtn")
    ?.addEventListener("click", fetchAndRenderVisits);

  const visitorSearchInput = document.getElementById("visitor-search");
  const clearSearchBtn = document.getElementById("clearSearchBtn");

  visitorSearchInput?.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredVisits = allTodayVisits.filter(
      (visit) =>
        visit.visitor?.name?.toLowerCase().includes(searchTerm) ||
        visit.visitor?.company?.toLowerCase().includes(searchTerm) ||
        visit.id?.toLowerCase().includes(searchTerm)
    );

    renderVisitsList(
      filteredVisits.filter(
        (v) => v.status === "Pending" || v.status === "Approved"
      ),
      "expected-visits-list",
      fetchAndRenderVisits
    );
    renderVisitsList(
      filteredVisits.filter((v) => v.status === "Checked-In"),
      "checked-in-visits-list",
      fetchAndRenderVisits
    );
    renderVisitsList(
      filteredVisits.filter(
        (v) => v.status === "Completed" || v.status === "Cancelled"
      ),
      "completed-visits-list",
      fetchAndRenderVisits
    );
  });

  clearSearchBtn?.addEventListener("click", () => {
    visitorSearchInput.value = "";
    fetchAndRenderVisits();
  });

  function setupVisitActionListeners(fetchAndRenderVisitsCallback) {
    const visitsTabContent = document.getElementById("visits-tabContent");
    if (!visitsTabContent) return;

    visitsTabContent.addEventListener("click", async (e) => {
      const target = e.target;
      const isCheckInBtn = target.classList.contains("check-in-btn");
      const isCheckOutBtn = target.classList.contains("check-out-btn");

      if (isCheckInBtn || isCheckOutBtn) {
        const visitId = target.dataset.visitId;
        const action = target.dataset.action;

        if (visitId && action) {
          await handleCheckInOutAction(
            visitId,
            action,
            checkInOutStatusMessageAreaId,
            fetchAndRenderVisitsCallback
          );
        }
      }
    });
  }

  return fetchAndRenderVisits;
}
