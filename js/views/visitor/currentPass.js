// js/views/visitor/currentPass.js
import {
  formatDateTime,
  getStatusColor,
  getDurationLabel,
} from "../../utils/helpers.js";

export function renderVisitStatus(visitorData) {
  const activeVisits = (visitorData.visitHistory || []).filter(
    (visit) =>
      visit.status === "Approved" ||
      visit.status === "Pending" ||
      visit.status === "Routing"
  );

  return `
    <div class="card-header bg-light text-dark">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Your Active Visit Passes</h5>
        <button class="btn btn-sm btn-outline-primary" id="requestVisitBtn">
          <i class="fas fa-plus me-1"></i> New Visit
        </button>
      </div>
    </div>
    <div class="card-body">
      ${
        activeVisits.length > 0
          ? `<div class="row g-3">` +
            activeVisits
              .map(
                (visit) => `
              <div class="col-12 col-md-6">
                <div class="card mb-3 border-${getStatusColor(
                  visit.status
                ).replace("badge-", "")}">
                  <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 class="mb-0">${visit.purpose}</h6>
                        <small class="text-muted">ID: ${visit.id}</small>
                      </div>
                      <span class="badge ${getStatusColor(visit.status)}">
                        ${visit.status}
                      </span>
                    </div>
                    <div class="mb-2">
                      <small><strong>Host:</strong> ${visit.host}</small>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                      <small><strong>Date:</strong> ${
                        formatDateTime(visit.visitDate).split(",")[0]
                      }</small>
                      <small><strong>Time:</strong> ${getDurationLabel(
                        visit.duration
                      )}</small>
                    </div>
                    ${
                      visit.status === "Approved"
                        ? `
                          <div class="text-center my-2">
                            <div id="visitQrCode-${visit.id}" style="width: 120px; height: 120px; margin: 0 auto;"></div>
                            <small class="text-muted">Show at entry</small>
                          </div>
                        `
                        : `
                          <div class="text-center my-2 py-2 bg-light rounded">
                            <i class="fas fa-qrcode fa-2x text-muted mb-2"></i>
                            <p class="small text-muted mb-0">QR code will appear once approved</p>
                          </div>
                        `
                    }
                    ${
                      ["Pending", "Approved", "Routing"].includes(visit.status)
                        ? `
                          <div class="d-grid mt-2">
                            <button class="btn btn-sm btn-outline-danger" data-visit-id="${visit.id}" id="cancelVisitBtn-${visit.id}">
                              <i class="fas fa-times me-1"></i> Cancel
                            </button>
                          </div>
                        `
                        : ""
                    }
                  </div>
                </div>
              </div>
            `
              )
              .join("") +
            `</div>`
          : `
            <div class="text-center py-4">
              <i class="fas fa-calendar-check fa-3x text-muted mb-3"></i>
              <p class="lead">No active visit passes</p>
              <p class="text-muted small">Click "New Visit" button to request access</p>
            </div>
          `
      }
    </div>
  `;
}
