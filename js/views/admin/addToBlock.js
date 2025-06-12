// js/components/addToBlock.js

export function createBlacklistModal() {
  return `
    <div class="modal fade" id="blacklistModal" tabindex="-1" aria-labelledby="blacklistModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="blacklistModalLabel">Add to Blacklist</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="blacklistForm">
              <div class="mb-3">
              <label for="blacklistVisitorName" class="form-label">Name</label>
              <input type="text" class="form-control" id="blacklistVisitorName" name="name" required>
              </div>
              <div class="mb-3">
                <label for="blacklistEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="blacklistEmail" name="email" required>
              </div>
              <div class="mb-3">
                <label for="blacklistMobileNumber" class="form-control-label">Phone Number</label>
                <input type="tel" class="form-control" id="blacklistMobileNumber" name="mobile" required>
              </div>
              <!-- Optional: Reason field -->
              <div class="mb-3">
                <label for="blacklistReason" class="form-label">Reason (Optional)</label>
                <textarea class="form-control" id="blacklistReason" name="reason" rows="3"></textarea>
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
        <p class="card-text"><strong>Company:</strong> ${
          visitor.company || "N/A"
        }</p>
        <p class="card-text"><strong>Host:</strong> ${visitor.host || "N/A"}</p>
        <p class="card-text"><strong>Check-in:</strong> ${
          visitor.checkInTime
            ? new Date(visitor.checkInTime).toLocaleString()
            : "N/A"
        }</p>
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
