// js/components/addToBlock.js
export function populateVisitorSelect(visitors) {
  const select = document.getElementById("blacklistVisitorSelect");
  if (!select) return;

  select.innerHTML =
    '<option value="">-- Select an existing visitor --</option>';
  visitors.forEach((visitor) => {
    const option = document.createElement("option");
    option.value = visitor.id;
    option.textContent = `${visitor.name} (${visitor.email || "No email"})`;
    select.appendChild(option);
  });

  // Setup auto-fill logic here
  select.addEventListener("change", function () {
    const visitorId = this.value;
    const nameInput = document.getElementById("blacklistVisitorName");
    const emailInput = document.getElementById("blacklistEmail");
    const mobileInput = document.getElementById("blacklistMobileNumber");
    const reasonInput = document.getElementById("blacklistReason");

    if (visitorId && visitorId !== "new") {
      // If a valid visitor is selected
      const visitor = visitors.find((v) => v.id === visitorId);
      if (visitor) {
        nameInput.value = visitor.name || "";
        emailInput.value = visitor.email || "";
        mobileInput.value = visitor.phone || "";
      }
    } else {
      nameInput.value = "";
      emailInput.value = "";
      mobileInput.value = "";
      reasonInput.value = "";
    }
  });
}

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
                <label for="blacklistVisitorSelect" class="form-label">Select Existing Visitor (Optional)</label>
                <select class="form-control" id="blacklistVisitorSelect" name="visitorId">
                  </select>
              </div>
              <div class="mb-3">
                <label for="blacklistVisitorName" class="form-label">Name</label>
                <input type="text" class="form-control" id="blacklistVisitorName" name="name" required>
              </div>
              <div class="mb-3">
                <label for="blacklistEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="blacklistEmail" name="email" required>
              </div>
              <div class="mb-3">
                <label for="blacklistMobileNumber" class="form-control-label">Phone Number (Optional)</label>
                <input type="tel" class="form-control" id="blacklistMobileNumber" name="mobile" pattern="[0-9]{10}"
                  title="Please enter a 10-digit phone number or leave blank">
              </div>
              <div class="mb-3">
                <label for="blacklistReason" class="form-label">Reason</label>
                <textarea class="form-control" id="blacklistReason" name="reason" rows="3" required></textarea>
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
