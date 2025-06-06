import { showLoading, hideLoading } from "../utils/helpers.js";

export default async function initGuardView() {
  const content = document.getElementById("role-content");
  if (!content) return;

  showLoading(content);

  try {
    const guardName = sessionStorage.getItem("username") || "Guard";

    content.innerHTML = `
      <div class="container">
        <div class="card shadow rounded-4 p-4 mb-4 d-flex flex-row justify-content-between align-items-center">
          <p class="text-muted">You are responsible for verifying and checking in visitors at the gate.</p>
          <div class="col-md-4 text-md-end">
            <button id="addVisitorBtn" class="btn btn-light rounded-pill px-4">
              <i class="fas fa-plus me-2"></i>Add New Visitor
            </button>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-md-6">
            <div class="card border-dark rounded-4 p-3 h-100">
              <h5 class="mb-2">Check-In Visitors</h5>
              <p>Verify ID and approve entry for registered visitors.</p>
              <button id="startCheckInBtn" class="btn btn-outline-primary-custom mt-2">Start Check-In</button>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card border-dark rounded-4 p-3 h-100">
              <h5 class="mb-2">Today's Visitors</h5>
              <p>View the list of visitors expected to arrive today.</p>
              <button id="viewVisitorsBtn" class="btn btn-outline-secondary mt-2">View List</button>
            </div>
          </div>
        </div>
      </div>

      <div id="section-scanner" class="section-content hidden mt-4 mb-4 w-100">
        <div class="card p-3 border-dark rounded-4">
        <h1 class="text-2xl font-semibold mb-4">QR Code Scanner</h1>
          <div class="card-body d-flex flex-column align-items-center">
            
            <div class="scanner-box border border-2 border-dashed border-gray-300 rounded-lg p-4 mb-3 text-muted" style="height:180px; width:180px; display:flex; align-items:center; justify-content:center; background:#f8f9fa; border-radius: 8px;">
                Camera preview here
              </div>
            <div class="scanner-container mx-auto max-w-md text-center">
              <div class="scanner-instructions mt-3">
                <h2 class="scanner-title">Scan Visitor QR Code</h2>
                <p class="scanner-help">Position the QR code within the scanner frame to check-in or check-out a visitor.</p>
              </div>
              
              <div class="manual-entry mt-4">
                <h3 class="manual-entry-title">Manual Entry</h3>
                <p class="text-sm text-neutral-500 mb-2">If the QR code cannot be scanned, enter the visit code manually:</p>
                <form class="manual-entry-form">
                  <div class="form-group">
                    <input type="text" id="visit-code" class="form-control" placeholder="Enter visit code">
                  </div>
                  <button type="submit" class="btn btn-outline-primary-custom mt-3">Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Dummy scanner logic
    const dummyScanBtn = document.getElementById("dummyScanBtn");
    const dummyScanResult = document.getElementById("dummy-scan-result");
    if (dummyScanBtn && dummyScanResult) {
      dummyScanBtn.addEventListener("click", () => {
        dummyScanResult.textContent = "Scanned: VISITOR123456";
        dummyScanResult.classList.remove("text-muted");
        dummyScanResult.classList.add("text-success");
      });
    }

    setupGuardEventListeners();
  } catch (error) {
    console.error("Guard view error:", error);
    showAlert(content, "Failed to load guard view", "danger");
  } finally {
    hideLoading();
  }
}

function setupGuardEventListeners() {
  document.getElementById("startCheckInBtn")?.addEventListener("click", () => {
    // Handle check-in process
  });

  document.getElementById("viewVisitorsBtn")?.addEventListener("click", () => {
    // Handle viewing visitors list
  });

  document.getElementById("addVisitorBtn")?.addEventListener("click", () => {
    // Handle adding new visitor
  });
}
