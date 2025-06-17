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
      <div class="blacklist-management-container">
        <h4 class="mb-4 fw-semibold">
          <i class="fa-solid fa-ban me-2 text-dark"></i> Blacklist Management
        </h4>
        <button class="btn btn-outline-danger d-flex align-items-center mb-3" id="addBlacklistEntryBtn">
          <i class="fa-solid fa-user-lock me-2"></i> Add to Blacklist
        </button>
        <div class="table-responsive rounded shadow-sm">
          <table class="table table-hover table-striped align-middle mb-0">
            <thead class="table-light sticky-top">
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
                  <td class="fw-medium">${entry.name || "N/A"}</td>
                  <td>${entry.mobile || "N/A"}</td>
                  <td>${entry.reason || "-"}</td>
                  <td>
                    ${
                      entry.addedOn
                        ? `<span class="badge bg-light text-secondary">${new Date(
                            entry.addedOn
                          ).toLocaleDateString()}</span>`
                        : "N/A"
                    }
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-danger d-flex align-items-center remove-blacklist-btn" data-id="${
                      entry.id
                    }" aria-label="Remove from Blacklist" title="Remove">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </td>
                </tr>`
                      )
                      .join("")
                  : ""
              }
            </tbody>
          </table>
          <div id="emptyState" class="text-center py-5${
            blacklist.length > 0 ? " d-none" : ""
          }">
            <i class="fa-solid fa-user-lock fa-2x text-muted mb-2"></i>
            <div class="text-muted">No blacklisted entries found.</div>
          </div>
        </div>
        <div id="modals-container"></div>
      </div>
    `;

    // Add Blacklist Entry Button Click Handler
    document
      .getElementById("addBlacklistEntryBtn")
      .addEventListener("click", () => {
        const modalsContainer = document.getElementById("modals-container");
        modalsContainer.innerHTML = createBlacklistModal();

        const blacklistModalElement = document.getElementById("blacklistModal");
        const blacklistModal = new bootstrap.Modal(blacklistModalElement);
        blacklistModal.show();

        populateVisitorSelect(visitors);

        const blacklistForm = document.getElementById("blacklistForm");
        const modalBody = blacklistModalElement.querySelector(".modal-body");

        if (blacklistForm) {
          blacklistForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = document
              .getElementById("blacklistVisitorName")
              .value.trim();
            const phone = document
              .getElementById("blacklistMobileNumber")
              .value.trim();
            const reason = document
              .getElementById("blacklistReason")
              .value.trim();

            if (!name || !phone) {
              showAlert(
                modalBody,
                "Please fill in all required fields (Name, Phone).",
                "warning"
              );
              return;
            }

            showLoading(content);
            try {
              await VisitorService.addToBlacklist({
                name,
                mobile: phone,
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
                  initBlacklistManagement();
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

    // Remove Blacklist Entry Handler
    document
      .querySelector("table tbody")
      .addEventListener("click", async (event) => {
        if (event.target.closest(".remove-blacklist-btn")) {
          const btn = event.target.closest(".remove-blacklist-btn");
          const entryId = btn.dataset.id;

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
