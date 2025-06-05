import { formatDateTime, getStatusColor } from "../../utils/helpers.js";

//<canvas id="visitQrCode" class="img-fluid"></canvas> put in line 42
export function renderVisitStatus(visitorData) {
  return `
    <!-- Current Visit Status -->
    <div>
      <div class="card shadow-sm">
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
                    <img src="https://media.istockphoto.com/id/1356977335/photo/a-man-in-a-mask-holds-on-to-the-bars-made-of-qr-code-isolated-on-a-white-background-concept.jpg?s=612x612&w=0&k=20&c=fjS7QkYfdUtJctS-14AxPvaOJAunTT3j21rrtno_CF4="
                    class="img-fluid mb-3"
                    style="max-width: 200px;"
                    alt="QR Code"
                    title="QR Code"
                    id="visitQrCode" />
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
