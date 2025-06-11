// js/views/host/upcomingVisitsSection.js

// Make sure to import helpers if formatDateTime or other utilities are used
import { formatDateTime, getStatusColor } from "../../utils/helpers.js";

export function renderUpcomingVisitsSection(upcomingVisits, hostName) {
  const container = document.getElementById("upcoming-visits-container"); // Note the ID
  if (!container) {
    console.error("Upcoming visits container not found!");
    return;
  }

  // Clear any existing content or loading indicators
  container.innerHTML = "";

  if (upcomingVisits && upcomingVisits.length > 0) {
    // Sort visits by date/time (earliest first)
    upcomingVisits.sort(
      (a, b) =>
        new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
    );

    upcomingVisits.forEach((visit) => {
      const visitCard = document.createElement("div");
      visitCard.className = "card mb-2 shadow-sm"; // Basic styling for each visit item
      visitCard.innerHTML = `
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title mb-1">${visit.visitorName}</h5>
                        <p class="card-text mb-1">${visit.purpose}</p>
                        <small class="text-muted">
                            Scheduled: ${formatDateTime(visit.visitDate)}
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
    // Display the "no visits" message if array is empty
    container.innerHTML = `
            <div class="text-center text-muted p-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray">
                    <path d="M8 2v4"></path>
                    <path d="M16 2v4"></path>
                    <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                    <path d="M3 10h18"></path>
                </svg>
                <p class="text-gray">No upcoming visits.</p>
            </div>
        `;
  }
}
