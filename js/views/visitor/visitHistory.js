import { formatDateTime, getStatusColor } from "../../utils/helpers.js";

export function renderVisitHistory(visitorData) {
  // Check if visitorData exists and has visitHistory
  if (!visitorData || !visitorData.visitHistory) {
    return `
      <div class="card shadow-sm mt-4">
        <div class="card-header bg-dark text-white">
          <h5 class="mb-0">Visit History</h5>
        </div>
        <div class="card-body">
          <div class="alert alert-info">No visit history available</div>
        </div>
      </div>
    `;
  }

  // Check if visitHistory is empty
  if (visitorData.visitHistory.length === 0) {
    return `
      <div class="card shadow-sm mt-4">
        <div class="card-header bg-dark text-white">
          <h5 class="mb-0">Visit History</h5>
        </div>
        <div class="card-body">
          <div class="alert alert-info">No previous visits found</div>
        </div>
      </div>
    `;
  }

  return `
    <div class="card shadow-sm mt-4">
      <div class="card-header bg-dark text-white">
        <h5 class="mb-0">Visit History</h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Date</th>
                <th>Purpose</th>
                <th>Host</th>
                <th>Entry Time</th>
                <th>Exit Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="visitHistoryBody">
              ${visitorData.visitHistory
                .map(
                  (visit) => `
                  <tr>
                    <td>${
                      visit.date ? formatDateTime(visit.date, false) : "N/A"
                    }</td>
                    <td>${visit.purpose || "N/A"}</td>
                    <td>${visit.host || "N/A"}</td>
                    <td>${
                      visit.entryTime
                        ? formatDateTime(visit.entryTime, true)
                        : "N/A"
                    }</td>
                    <td>${
                      visit.exitTime
                        ? formatDateTime(visit.exitTime, true)
                        : "N/A"
                    }</td>
                    <td>
                      <span class="badge bg-${getStatusColor(visit.status)}">
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
