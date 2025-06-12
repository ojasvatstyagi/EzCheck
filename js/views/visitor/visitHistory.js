// js/views/visitor/visitHistory.js
import { formatDateTime, getStatusColor } from "../../utils/helpers.js";

export function renderVisitHistory(visitorData) {
  // Check if visitorData exists or if visitHistory property is missing/null/undefined
  if (!visitorData || !visitorData.visitHistory) {
    return `
      <div class="card shadow-sm mt-4">
        <div class="card-header bg-light text-dark">
          <h5 class="mb-0">Visit History</h5>
        </div>
        <div class="text-center text-muted p-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray-custom">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
              <line x1="16" x2="16" y1="2" y2="6"></line>
              <line x1="8" x2="8" y1="2" y2="6"></line>
              <line x1="3" x2="21" y1="10" y2="10"></line>
          </svg>
          <p class="text-gray">No visit history available.</p>
        </div>
      </div>
    `;
  }

  // Check if visitHistory is an empty array
  if (visitorData.visitHistory.length === 0) {
    return `
      <div class="card shadow-sm mt-4">
        <div class="card-header bg-light text-dark">
          <h5 class="mb-0">Visit History</h5>
        </div>
        <div class="text-center text-muted p-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
              <line x1="16" x2="16" y1="2" y2="6"></line>
              <line x1="8" x2="8" y1="2" y2="6"></line>
              <line x1="3" x2="21" y1="10" y2="10"></line>
          </svg>
          <p class="text-gray">No previous visits found.</p>
        </div>
      </div>
    `;
  }

  return `
    <div class="card shadow-sm mt-4">
      <div class="card-header bg-light text-dark">
        <h5 class="mb-0">Visit History</h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Date (Scheduled)</th>
                <th>Purpose</th>
                <th>Host</th>
                <th>Check-In Time</th>
                <th>Check-Out Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="visitHistoryBody">
              ${visitorData.visitHistory
                .map(
                  (visit) => `
                  <tr id="visit-history-row-${visit.id}">
                    <td class="text-nowrap">${
                      visit.date ? formatDateTime(visit.date, false) : "N/A"
                    }</td>
                    <td>${visit.purpose || "N/A"}</td>
                    <td>${visit.host || "N/A"}</td>
                    <td class="text-nowrap">${
                      visit.entryTime && visit.entryTime !== ""
                        ? formatDateTime(visit.entryTime, true)
                        : "N/A"
                    }</td>
                    <td class="text-nowrap">${
                      visit.exitTime && visit.exitTime !== ""
                        ? formatDateTime(visit.exitTime, true)
                        : "N/A"
                    }</td>
                    <td>
                      <span class="badge ${getStatusColor(visit.status)}">
                        ${visit.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
