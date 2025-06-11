// js/views/host/hostVisitHistorySection.js

import { formatDateTime, getStatusColor } from "../../utils/helpers.js";

export function renderHostVisitHistorySection(visitHistory, hostName) {
  const container = document.getElementById("host-visit-history-container"); // Note the ID
  if (!container) {
    console.error("Host visit history container not found!");
    return;
  }

  // Clear any existing content or loading indicators
  container.innerHTML = "";

  if (visitHistory && visitHistory.length > 0) {
    // Sort history by checkOutTime or visitDate, newest first
    visitHistory.sort((a, b) => {
      const dateA = new Date(a.checkOutTime || a.visitDate).getTime();
      const dateB = new Date(b.checkOutTime || b.visitDate).getTime();
      return dateB - dateA; // Sort descending (newest first)
    });

    visitHistory.forEach((visit) => {
      const visitCard = document.createElement("div");
      visitCard.className = "card mb-2 shadow-sm"; // Basic styling for each visit item
      visitCard.innerHTML = `
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title mb-1">${visit.visitorName}</h5>
                        <p class="card-text mb-1">${visit.purpose}</p>
                        <small class="text-muted">
                            Visit: ${formatDateTime(visit.visitDate)}
                            ${visit.company ? ` | ${visit.company}` : ""}
                            <br>
                            Status: <span class="badge ${getStatusColor(
                              visit.status
                            )}">${visit.status}</span>
                            ${
                              visit.checkInTime
                                ? ` | Check-in: ${formatDateTime(
                                    visit.checkInTime
                                  )}`
                                : ""
                            }
                            ${
                              visit.checkOutTime
                                ? ` | Check-out: ${formatDateTime(
                                    visit.checkOutTime
                                  )}`
                                : ""
                            }
                        </small>
                        ${
                          visit.notes
                            ? `<p class="text-info small mt-1 mb-0">Notes: ${visit.notes}</p>`
                            : ""
                        }
                    </div>
                </div>
            `;
      container.appendChild(visitCard);
    });
  } else {
    // Display the "no history" message if array is empty
    container.innerHTML = `
            <div class="text-center text-muted p-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray-custom">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <p class="text-gray-custom">No past visit history to display.</p>
            </div>
        `;
  }
}
