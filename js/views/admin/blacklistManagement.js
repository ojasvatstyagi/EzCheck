import { fetchBlacklist } from "../../../api/visitorApi.js";
import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";
import { createBlacklistModal } from "./addToBlock.js";

export default async function initBlacklistManagement() {
  const content = document.getElementById("role-content");
  showLoading(content);

  try {
    const blacklist = await fetchBlacklist();

    content.innerHTML = `
      <h4 class="mb-4">Blacklist Management</h4>
      <button class="btn btn-sm btn-outline-primary-custom mb-3" id="addBlacklistEntry">Add to Blacklist</button>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr><th>Name</th><th>ID</th><th>Mobile</th><th>Reason</th><th>Added On</th><th>Actions</th></tr>
          </thead>
          <tbody>
            ${blacklist
              .map(
                (entry) => `
              <tr>
                <td>${entry.name}</td>
                <td>${entry.idNumber}</td>
                <td>${entry.mobile}</td>
                <td>${entry.reason || "-"}</td>
                <td>${new Date(entry.addedOn).toLocaleDateString()}</td>
                <td><button class="btn btn-sm btn-danger remove-blacklist" data-id="${
                  entry.id
                }">Remove</button></td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
      <div id="modals-container"></div>
    `;

    // Modal logic
    document
      .getElementById("addBlacklistEntry")
      .addEventListener("click", () => {
        document.getElementById("modals-container").innerHTML =
          createBlacklistModal();
        new bootstrap.Modal(document.getElementById("blacklistModal")).show();
      });

    // Listener for remove blacklist
  } catch (e) {
    showAlert(content, "Failed to load blacklist", "danger");
  } finally {
    hideLoading();
  }
}
