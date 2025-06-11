// js/views/host/pendingRequestsSection.js

import {
  formatDateTime,
  getStatusColor,
  showAlert,
} from "../../utils/helpers.js";
import VisitorService from "../../../api/visitorApi.js";

export function renderPendingRequestsSection(
  pendingRequests,
  hostName,
  refreshDashboardCallback
) {
  const container = document.getElementById("pending-requests-container");
  if (!container) {
    console.error("Pending requests container not found!");
    return;
  }

  // Clear any existing content or loading indicators
  container.innerHTML = "";

  if (pendingRequests && pendingRequests.length > 0) {
    // Sort requests by visit date/time (earliest first)
    pendingRequests.sort(
      (a, b) =>
        new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
    );

    pendingRequests.forEach((request) => {
      const requestItem = document.createElement("div");
      requestItem.className = "card mb-2 shadow-sm"; // Basic styling for each request item
      requestItem.innerHTML = `
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title mb-1">${request.visitorName}</h5>
                        <p class="card-text mb-1">${request.purpose}</p>
                        <small class="text-muted">
                            Requested: ${formatDateTime(
                              request.requestDate
                            )} | Visit: ${formatDateTime(request.visitDate)}
                        </small>
                        ${
                          request.notes
                            ? `<p class="text-info small mt-1 mb-0">Notes: ${request.notes}</p>`
                            : ""
                        }
                    </div>
                    <div class="d-flex flex-column align-items-end">
                        <span class="badge ${getStatusColor(
                          request.status
                        )} mb-2">${request.status}</span>
                        <div class="gap-2" role="group" aria-label="Request actions">
                            <button class="btn btn-sm btn-outline-success approve-btn" data-id="${
                              request.id
                            }">Approve</button>
                            <button class="btn btn-sm btn-outline-danger decline-btn" data-id="${
                              request.id
                            }">Decline</button>
                        </div>
                    </div>
                </div>
            `;
      container.appendChild(requestItem);
    });

    // Attach event listeners for Approve/Decline buttons
    container.querySelectorAll(".approve-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const visitId = event.target.dataset.id;
        await handleRequestAction(
          visitId,
          "Approved",
          hostName,
          refreshDashboardCallback
        );
      });
    });

    container.querySelectorAll(".decline-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const visitId = event.target.dataset.id;
        await handleRequestAction(
          visitId,
          "Declined",
          hostName,
          refreshDashboardCallback
        );
      });
    });
  } else {
    // Display the "no requests" message if array is empty
    container.innerHTML = `
            <div class="text-center text-muted p-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray">
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                </svg>
                <p>You don't have any pending visit requests.</p>
            </div>
        `;
  }
}

// Function to handle approving/declining a request
async function handleRequestAction(
  visitId,
  newStatus,
  hostName,
  refreshDashboardCallback
) {
  try {
    // Placeholder for API call to update visit status
    console.log(`Attempting to update visit ${visitId} to ${newStatus}`);
    await VisitorService.updateVisitStatus(visitId, newStatus);

    // For now, simulate success:
    await new Promise((resolve) => setTimeout(resolve, 300));

    showAlert(
      document.body,
      `Visit ${newStatus.toLowerCase()} successfully!`,
      "success"
    );
    if (refreshDashboardCallback) {
      refreshDashboardCallback(hostName); // Refresh the dashboard after action
    }
  } catch (error) {
    console.error(`Error updating visit status for ${visitId}:`, error);
    showAlert(
      document.body,
      `Failed to ${newStatus.toLowerCase()} visit: ${error.message}`,
      "danger"
    );
  }
}
