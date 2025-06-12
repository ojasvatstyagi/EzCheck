import { formatDateTime, getStatusColor } from "../../utils/helpers.js";

export function renderVisitStatus(visitorData) {
  return `
    <div>
      <div class="card shadow-sm">
        <div class="card-header bg-light text-dark">
          <h5 class="mb-0">Current Visit Status</h5>
        </div>
        <div class="card-body">
          ${
            visitorData.currentVisit
              ? `
            <div class="row align-items-center">
              <div class="col-md-6">
                <h5>${visitorData.currentVisit.purpose}</h5>
                <p class="mb-1"><strong>Host:</strong> ${
                  visitorData.currentVisit.host
                }</p>
                <p class="mb-1"><strong>Visit ID:</strong> ${
                  visitorData.currentVisit.id
                }</p>
                <p class="mb-1"><strong>Date:</strong> ${formatDateTime(
                  visitorData.currentVisit.visitDate
                )}</p>
                <p class="mb-1"><strong>Status:</strong>
                  <span class="badge ${getStatusColor(
                    visitorData.currentVisit.status
                  )}">
                    ${visitorData.currentVisit.status}
                  </span>
                </p>
              </div>
              <div class="col-md-6 text-center">
                ${
                  visitorData.currentVisit.status === "Approved"
                    ? `
                    <div id="visitQrCode" class="mb-3" style="width: 200px; height: 200px; margin: 0 auto;"></div>
                    <p class="mt-2 text-muted">Show this QR code at entry</p>
                `
                    : `
                  <p class="text-muted">QR code will appear after approval</p>
                `
                }
              </div>
            </div>
            <div class="mt-3">
              ${
                visitorData.currentVisit.status === "Pending" ||
                visitorData.currentVisit.status === "Approved"
                  ? `
                <button class="btn btn-sm btn-outline-danger" id="cancelVisitBtn">
                  <i class="fas fa-times me-1"></i> Cancel Request
                </button>
              `
                  : ""
              }
            </div>
          `
              : `
            <div class="text-center py-4">
              <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
              <h5>No upcoming visits</h5>
              <button class="btn btn-outline-primary-custom mt-2" id="requestVisitBtn">
                <i class="fas fa-plus me-1"></i> Request New Visit
              </button>
            </div>
          `
          }
        </div>
      </div>
    </div>
  `;
}
