// js/views/admin/blacklistManagement.js

import VisitorService from "../../../api/visitorApi.js";
import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";
import { createBlacklistModal, populateVisitorSelect } from "./addToBlock.js";

export default async function initBlacklistManagement() {
  const content = document.getElementById("role-content");
  showLoading(content);

  try {
    const blacklist = await VisitorService.fetchBlacklist();
    const visitors = await VisitorService.fetchVisitorsIfNotBlacklisted();

    content.innerHTML = `
      <h4 class="mb-4">Blacklist Management</h4>
      <button class="btn btn-sm btn-outline-primary-custom mb-3" id="addBlacklistEntryBtn">Add to Blacklist</button>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Reason</th>
              <th>Added On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${
              blacklist.length > 0
                ? blacklist
                    .map(
                      (entry) => `
              <tr>
                <td>${entry.name || "N/A"}</td>
                <td>${entry.mobile || "N/A"}</td>
                <td>${entry.reason || "-"}</td>
                <td>${
                  entry.addedOn
                    ? new Date(entry.addedOn).toLocaleDateString()
                    : "N/A"
                }</td>
                <td>
                  <button class="btn btn-sm btn-outline-danger remove-blacklist-btn" data-id="${
                    entry.id
                  }">Remove</button>
                </td>
              </tr>`
                    )
                    .join("")
                : `<tr><td colspan="6" class="text-center">No blacklisted entries found.</td></tr>`
            }
          </tbody>
        </table>
      </div>
      <div id="modals-container"></div>
    `;

    // Add Blacklist Entry Button Click Handler
    document
      .getElementById("addBlacklistEntryBtn")
      .addEventListener("click", () => {
        const modalsContainer = document.getElementById("modals-container");
        modalsContainer.innerHTML = createBlacklistModal(); // Create and append the modal HTML

        const blacklistModalElement = document.getElementById("blacklistModal");
        const blacklistModal = new bootstrap.Modal(blacklistModalElement);
        blacklistModal.show();

        // Populate visitor select and set up auto-fill
        populateVisitorSelect(visitors);

        const blacklistForm = document.getElementById("blacklistForm");
        const modalBody = blacklistModalElement.querySelector(".modal-body");

        if (blacklistForm) {
          blacklistForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = document
              .getElementById("blacklistVisitorName")
              .value.trim();
            const mobile = document
              .getElementById("blacklistMobileNumber")
              .value.trim();
            const reason = document
              .getElementById("blacklistReason")
              .value.trim();

            if (!name || !phone) {
              showAlert(
                modalBody, // Show alert inside the modal body
                "Please fill in all required fields (Name, phone).",
                "warning"
              );
              return;
            }

            showLoading(content);
            try {
              await VisitorService.addToBlacklist({
                name,
                mobile: phone, // Mobile is now optional
                reason: reason,
                addedOn: new Date().toISOString(),
                id: `BL-${Date.now()}-${Math.random()
                  .toString(36)
                  .substr(2, 5)}`,
              });

              showAlert(
                content,
                "Visitor successfully added to blacklist!",
                "success"
              );
              blacklistModal.hide();

              blacklistModalElement.addEventListener(
                "hidden.bs.modal",
                function handler() {
                  modalsContainer.innerHTML = "";
                  blacklistModalElement.removeEventListener(
                    "hidden.bs.modal",
                    handler
                  );
                  initBlacklistManagement(); // Re-render the blacklist table
                }
              );
            } catch (error) {
              console.error("Error adding to blacklist:", error);
              showAlert(
                modalBody,
                `Failed to add visitor to blacklist: ${error.message}`,
                "danger"
              );
            } finally {
              hideLoading();
            }
          });
        }
      });

    // Event Listener for removing from Blacklist
    document
      .querySelector("table tbody")
      .addEventListener("click", async (event) => {
        if (event.target.classList.contains("remove-blacklist-btn")) {
          const entryId = event.target.dataset.id;

          if (
            confirm(
              "Are you sure you want to remove this entry from the blacklist?"
            )
          ) {
            showLoading(content);
            try {
              await VisitorService.removeFromBlacklist(entryId);
              showAlert(
                content,
                "Blacklist entry removed successfully!",
                "success"
              );
              initBlacklistManagement();
            } catch (error) {
              console.error("Error removing from blacklist:", error);
              showAlert(
                content,
                `Failed to remove entry from blacklist: ${error.message}`,
                "danger"
              );
            } finally {
              hideLoading();
            }
          }
        }
      });
  } catch (e) {
    console.error("Failed to load blacklist management:", e);
    showAlert(
      content,
      "Failed to load blacklist management. Please try again.",
      "danger"
    );
  } finally {
    hideLoading();
  }
}
