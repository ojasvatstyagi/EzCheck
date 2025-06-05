import { fetchVisitors } from "../../../api/visitorApi.js";
import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";

export default async function initVisitorManagement() {
  const content = document.getElementById("role-content");
  showLoading(content);

  try {
    const visitors = await fetchVisitors();

    content.innerHTML = `
      <h4 class="mb-4">Visitor Management</h4>
      <input type="text" id="searchVisitor" placeholder="Search..." class="form-control mb-3">
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr><th>Name</th><th>ID</th><th>Entry</th><th>Exit</th><th>Actions</th></tr>
          </thead>
          <tbody>
            ${visitors
              .map(
                (v) => `
              <tr>
                <td>${v.name}</td>
                <td>${v.idNumber || "-"}</td>
                <td>${new Date(v.checkInTime).toLocaleString()}</td>
                <td>${
                  v.checkOutTime
                    ? new Date(v.checkOutTime).toLocaleString()
                    : "Inside"
                }</td>
                <td><button class="btn btn-md btn-primary" data-id="${
                  v.id
                }">View</button></td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    // Add listeners for searching and viewing visitor details
  } catch (e) {
    showAlert(content, "Failed to load visitors", "danger");
  } finally {
    hideLoading();
  }
}
