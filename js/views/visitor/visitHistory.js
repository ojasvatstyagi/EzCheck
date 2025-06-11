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
        <div class="card-body">
          <div class="alert alert-info" role="alert">No visit history available</div>
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
        <div class="card-body">
          <div class="alert alert-info" role="alert">No previous visits found</div>
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
