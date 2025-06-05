// js/components/cards.js
export function createBlacklistModal() {
  return `
    <div class="modal fade" id="blacklistModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">Add to Blacklist</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="blacklistForm">
              <div class="mb-3">
                <label class="form-label">Visitor Name</label>
                <input type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">ID Number</label>
                <input type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Mobile Number</label>
                <input type="tel" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Reason</label>
                <textarea class="form-control" rows="3"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" form="blacklistForm" class="btn btn-outline-primary-custom">Add to Blacklist</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
export function createVisitorCard(visitor) {
  return `
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">${visitor.name} <span class="badge bg-${
    visitor.isVIP ? "warning" : "secondary"
  }">${visitor.isVIP ? "VIP" : "Regular"}</span></h5>
        <p class="card-text"><strong>Company:</strong> ${visitor.company}</p>
        <p class="card-text"><strong>Host:</strong> ${visitor.host}</p>
        <p class="card-text"><strong>Check-in:</strong> ${new Date(
          visitor.checkInTime
        ).toLocaleString()}</p>
        <p class="card-text"><strong>Check-out:</strong> ${
          visitor.checkOutTime
            ? new Date(visitor.checkOutTime).toLocaleString()
            : "Not checked out"
        }</p>
        <button class="btn btn-danger" data-visitor-id="${
          visitor.id
        }" data-bs-toggle="modal" data-bs-target="#blacklistModal">Blacklist</button>
        <button class="btn btn-primary" data-visitor-id="${
          visitor.id
        }" data-bs-toggle="modal" data-bs-target="#checkOutModal">Check Out</button>
      </div>
        <div class="card-footer text-muted">
            <small>Visitor ID: ${visitor.id}</small>
        </div>
    </div>
    `;
}
