import VisitorService from "../../../api/visitorApi.js";
import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";

export default function initReporting() {
  const content = document.getElementById("role-content");

  content.innerHTML = `
    <div class="header mb-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h1 class="mb-3"><i class="fas fa-file-alt me-2"></i>Reporting</h1>
            <p class="mb-0">Export and monitor visitor logs easily</p>
          </div>
          <div class="col-md-4 text-md-end">
            <button class="btn btn-light rounded-pill px-4" id="exportReportBtn">
              <i class="fas fa-download me-2"></i>Export Report
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <h5 class="card-title mb-3">Report Status</h5>
          <div id="reportStatus" class="text-muted">Click the button above to export visitor data.</div>
        </div>
      </div>
    </div>
  `;

  document
    .getElementById("exportReportBtn")
    .addEventListener("click", async () => {
      try {
        showLoading();
        await VisitorService.exportReport();
        showAlert(
          document.getElementById("reportStatus"),
          "✅ Report exported successfully!",
          "success"
        );
      } catch (e) {
        showAlert(
          document.getElementById("reportStatus"),
          "❌ Export failed: " + e.message,
          "danger"
        );
      } finally {
        hideLoading();
      }
    });
}
