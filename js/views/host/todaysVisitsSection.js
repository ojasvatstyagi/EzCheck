// js/views/host/todaysVisitsSection.js

import { formatDateTime, getStatusColor } from "../../utils/helpers.js";

export function renderTodaysVisitsSection(todaysVisits, hostName) {
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

      relevantVisits.forEach((visit) => {
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
                        <span class="badge ${getStatusColor(visit.status)}">${
          visit.status
        }</span>
                    </div>
                `;
        container.appendChild(visitCard);
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
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray-custom">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                    <line x1="16" x2="16" y1="2" y2="6"></line>
                    <line x1="8" x2="8" y1="2" y2="6"></line>
                    <line x1="3" x2="21" y1="10" y2="10"></line>
                </svg>
                <p class="text-gray-custom">You don't have any visits scheduled for today.</p>
            </div>
        `;
  }
}
