// js/views/host/todaysVisitsSection.js

import {
  formatDateTime,
  getStatusColor,
  showAlert,
  showLoading,
  hideLoading,
} from "../../utils/helpers.js";
import VisitorService from "../../../api/visitorApi.js";

export function renderTodaysVisitsSection(
  todaysVisits,
  hostName,
  refreshCallback
) {
  const container = document.getElementById("today-visits-container"); // Note the ID
  if (!container) {
    console.error("Today's visits container not found!");
    return;
  }

  container.innerHTML = "";

  if (todaysVisits && todaysVisits.length > 0) {
    const relevantVisits = todaysVisits.filter(
      (visit) => visit.status === "Approved" || visit.status === "Checked-In"
    );

    if (relevantVisits.length > 0) {
      relevantVisits.sort(
        (a, b) =>
          new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
      );

      // Get cancellation buffer from VisitorService
      const cancellationBufferDays = VisitorService.cancellationBufferDays || 2;
      const msInDay = 1000 * 60 * 60 * 24;

      relevantVisits.forEach((visit) => {
        const nowTime = new Date().getTime();
        const pastBufferLimit = nowTime - cancellationBufferDays * msInDay;
        // Determine if a cancel button should be shown
        const canCancel =
          visit.status === "Approved" &&
          (visitDateTime > nowTime || visitDateTime >= pastBufferLimit);

        const cancelBtnHtml = canCancel
          ? `<button class="btn btn-md btn-outline-danger ms-auto cancel-visit-btn" data-visit-id="${visit.id}" data-visit-date="${visit.visitDate}">Cancel</button>`
          : "";

        const visitCard = document.createElement("div");
        visitCard.className = "card mb-2 shadow-sm";
        visitCard.innerHTML = `
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="card-title mb-1">${
                              visit.visitorName
                            }</h5>
                            <p class="card-text mb-1">${visit.purpose}</p>
                            <small class="text-muted">
                                Time: ${formatDateTime(visit.visitDate, {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                                ${visit.company ? ` | ${visit.company}` : ""}
                            </small>
                            ${
                              visit.notes
                                ? `<p class="text-info small mt-1 mb-0">Notes: ${visit.notes}</p>`
                                : ""
                            }
                        </div>
                        <div class="d-flex flex-column align-items-end gap-2">
                            <span class="badge ${getStatusColor(
                              visit.status
                            )}">${visit.status}</span>
                            ${cancelBtnHtml}
                        </div>
                    </div>
                `;
        container.appendChild(visitCard);
      });

      // Add event listener for cancel buttons using delegation
      container.querySelectorAll(".cancel-visit-btn").forEach((button) => {
        button.removeEventListener("click", handleCancelClick); // Prevent duplicate listeners
        button.addEventListener("click", (e) =>
          handleCancelClick(e, hostName, refreshCallback)
        );
      });
    } else {
      container.innerHTML = `
                <div class="text-center text-muted p-4">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                        <line x1="16" x2="16" y1="2" y2="6"></line>
                        <line x1="8" x2="8" y1="2" y2="6"></line>
                        <line x1="3" x2="21" y1="10" y2="10"></line>
                    </svg>
                    <p class="text-gray">No active visits for today.</p>
                </div>
            `;
    }
  } else {
    container.innerHTML = `
            <div class="text-center text-muted p-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                    <line x1="16" x2="16" y1="2" y2="6"></line>
                    <line x1="8" x2="8" y1="2" y2="6"></line>
                    <line x1="3" x2="21" y1="10" y2="10"></line>
                </svg>
                <p class="text-gray">You don't have any visits scheduled for today.</p>
            </div>
        `;
  }
}

// Handler for cancel button click
async function handleCancelClick(e, hostName, refreshCallback) {
  const visitId = e.target.dataset.visitId;
  const visitDate = e.target.dataset.visitDate;

  if (
    confirm(
      `Are you sure you want to cancel the visit scheduled for ${formatDateTime(
        visitDate
      )}?`
    )
  ) {
    showLoading(document.body); // Show loading indicator
    try {
      const response = await VisitorService.cancelApprovedVisitByHost(
        visitId,
        hostName
      );
      if (response.success) {
        showAlert(document.body, response.message, "success");
        refreshCallback(hostName); // Reload the dashboard data
      } else {
        showAlert(document.body, response.message, "danger");
      }
    } catch (error) {
      console.error("Error cancelling visit:", error);
      showAlert(
        document.body,
        "Failed to cancel visit: " + error.message,
        "danger"
      );
    } finally {
      hideLoading();
    }
  }
}
