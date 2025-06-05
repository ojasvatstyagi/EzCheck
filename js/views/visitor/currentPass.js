import { formatDateTime, getStatusColor } from "../../utils/helpers.js";

export function renderVisitStatus(visitorData) {
  return `
    <!-- Current Visit Status -->
    <div class="col-md-8 mb-4 ">
      <div class="card shadow-sm h-100">
        <div class="card-header bg-dark text-white">
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
                <p class="mb-1"><strong>Date:</strong> ${formatDateTime(
                  visitorData.currentVisit.date
                )}</p>
                <p class="mb-1"><strong>Status:</strong> 
                  <span class="badge bg-${getStatusColor(
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
                  <canvas id="visitQrCode" class="img-fluid"></canvas>
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
                visitorData.currentVisit.status === "Pending"
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
              <button class="btn btn-primary mt-2" id="requestVisitBtn">
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
