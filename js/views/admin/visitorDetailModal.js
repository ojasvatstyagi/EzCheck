// js/views/admin/visitorDetailModal.js

export function showVisitorDetailModal(visitorDetails, containerElement) {
  if (!visitorDetails || !containerElement) {
    console.error("Missing visitorDetails or containerElement for modal.");
    return;
  }

  const modalHtml = `
        <div class="modal fade" id="visitorDetailModal" tabindex="-1" aria-labelledby="visitorDetailModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title" id="visitorDetailModalLabel">Visitor Details: ${
                          visitorDetails.name
                        }</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <h6>Visitor Information:</h6>
                        <p><strong>ID:</strong> ${visitorDetails.id}</p>
                        <p><strong>Name:</strong> ${visitorDetails.name}</p>
                        <p><strong>Email:</strong> ${
                          visitorDetails.email || "N/A"
                        }</p>
                        <p><strong>Phone:</strong> ${
                          visitorDetails.phone || "N/A"
                        }</p>
                        <p><strong>Company:</strong> ${
                          visitorDetails.company || "N/A"
                        }</p>
                        <p><strong>ID Number:</strong> ${
                          visitorDetails.idNumber || "N/A"
                        }</p>
                        <p><strong>Blacklisted:</strong> ${
                          visitorDetails.isBlocked
                            ? '<span class="badge bg-danger">Yes</span>'
                            : '<span class="badge bg-success">No</span>'
                        }</p>

                        <h6>Current Visit:</h6>
                        ${
                          visitorDetails.currentVisit
                            ? `
                                <p><strong>Purpose:</strong> ${
                                  visitorDetails.currentVisit.purpose
                                }</p>
                                <p><strong>Host:</strong> ${
                                  visitorDetails.currentVisit.host
                                }</p>
                                <p><strong>Scheduled Date:</strong> ${new Date(
                                  visitorDetails.currentVisit.date
                                ).toLocaleDateString()}</p>
                                <p><strong>Status:</strong> <span class="badge bg-${
                                  visitorDetails.currentVisit.status ===
                                  "Checked-In"
                                    ? "info"
                                    : visitorDetails.currentVisit.status ===
                                      "Pending"
                                    ? "warning"
                                    : visitorDetails.currentVisit.status ===
                                      "Completed"
                                    ? "success"
                                    : "secondary"
                                }">${
                                visitorDetails.currentVisit.status
                              }</span></p>
                                <p><strong>Check-in Time:</strong> ${
                                  visitorDetails.currentVisit.entryTime
                                    ? new Date(
                                        visitorDetails.currentVisit.entryTime
                                      ).toLocaleString()
                                    : "N/A"
                                }</p>
                                <p><strong>Check-out Time:</strong> ${
                                  visitorDetails.currentVisit.checkOutTime
                                    ? new Date(
                                        visitorDetails.currentVisit.checkOutTime
                                      ).toLocaleString()
                                    : "N/A"
                                }</p>
                            `
                            : `<p>No active or pending visit.</p>`
                        }

                        <h6>Visit History:</h6>
                        <div style="max-height: 200px; overflow-y: auto;">
                            <ul class="list-group">
                                ${
                                  visitorDetails.visitHistory &&
                                  visitorDetails.visitHistory.length > 0
                                    ? visitorDetails.visitHistory
                                        .map(
                                          (visit) => `
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>${
                                              visit.purpose
                                            }</strong> with ${
                                            visit.host
                                          } on ${new Date(
                                            visit.date
                                          ).toLocaleDateString()}
                                            <br>
                                            <small>Status: ${
                                              visit.status
                                            } | Entry: ${
                                            visit.entryTime
                                              ? new Date(
                                                  visit.entryTime
                                                ).toLocaleString()
                                              : "N/A"
                                          } | Exit: ${
                                            visit.exitTime
                                              ? new Date(
                                                  visit.exitTime
                                                ).toLocaleString()
                                              : "N/A"
                                          }</small>
                                        </div>
                                        <span class="badge bg-${
                                          visit.status === "Completed"
                                            ? "success"
                                            : visit.status === "Declined" ||
                                              visit.status === "Cancelled"
                                            ? "danger"
                                            : "info"
                                        }">${visit.status}</span>
                                    </li>
                                `
                                        )
                                        .join("")
                                    : '<li class="list-group-item text-muted">No visit history.</li>'
                                }
                            </ul>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

  containerElement.innerHTML = modalHtml;

  const visitorDetailModalElement =
    document.getElementById("visitorDetailModal");
  const visitorDetailModal = new bootstrap.Modal(visitorDetailModalElement);

  visitorDetailModal.show();

  visitorDetailModalElement.addEventListener(
    "hidden.bs.modal",
    function handler() {
      containerElement.innerHTML = "";
      visitorDetailModalElement.removeEventListener("hidden.bs.modal", handler);
    }
  );
}
