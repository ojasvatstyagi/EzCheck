// js/views/admin/visitorManagement.js

import VisitorService from "../../../api/visitorApi.js";
import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";
import { showVisitorDetailModal } from "./visitorDetailModal.js";

let allVisitorsData = [];

function renderVisitorTable(visitorsToDisplay) {
  const tableBody = document.querySelector("#visitorTable tbody");
  const emptyState = document.getElementById("emptyState");
  if (!tableBody) return;

  if (visitorsToDisplay.length > 0) {
    tableBody.innerHTML = visitorsToDisplay
      .map((v) => {
        const latestVisit = v.latestVisit;
        const entryTime = latestVisit
          ? new Date(latestVisit.checkInTime).toLocaleString()
          : "-";
        let exitTime = "-";
        if (latestVisit && latestVisit.checkOutTime) {
          exitTime = new Date(latestVisit.checkOutTime).toLocaleString();
        } else if (latestVisit && latestVisit.status === "Checked-In") {
          exitTime =
            '<span class="badge bg-success bg-opacity-25 text-success">Inside</span>';
        }
        return `
          <tr>
            <td class="fw-medium">${v.name}</td>
            <td>${v.phone || "-"}</td>
            <td>${entryTime}</td>
            <td>${exitTime}</td>
            <td>
              ${
                v.isBlocked
                  ? '<span class="badge bg-danger"><i class="fa-solid fa-ban me-1"></i> Yes</span>'
                  : '<span class="badge bg-success"><i class="fa-solid fa-check me-1"></i> No</span>'
              }
            </td>
            <td>
              <button class="btn btn-sm btn-outline-primary view-visitor-btn" data-id="${
                v.id
              }" aria-label="View Details" title="View Details">
                <i class="fa-solid fa-eye"></i>
              </button>
            </td>
          </tr>
        `;
      })
      .join("");
    if (emptyState) emptyState.classList.add("d-none");
  } else {
    tableBody.innerHTML = "";
    if (emptyState) emptyState.classList.remove("d-none");
  }
}

export default async function initVisitorManagement() {
  const content = document.getElementById("role-content");
  showLoading(content);

  try {
    const [visitors, visits] = await Promise.all([
      VisitorService.fetchVisitors(),
      VisitorService.fetchAllVisits(),
    ]);

    allVisitorsData = visitors.map((visitor) => {
      const visitorVisits = visits
        .filter((visit) => visit.visitorId === visitor.id)
        .sort((a, b) => {
          const dateA = new Date(a.checkInTime || a.requestDate);
          const dateB = new Date(b.checkInTime || b.requestDate);
          return dateB.getTime() - dateA.getTime();
        });

      const latestVisit = visitorVisits.length > 0 ? visitorVisits[0] : null;

      return {
        ...visitor,
        latestVisit: latestVisit,
      };
    });

    // Enhanced HTML structure
    content.innerHTML = `
      <div class="visitor-management-container">
        <h4 class="mb-4 fw-semibold">
          <i class="fa-solid fa-address-book me-2 text-dark"></i> Visitor Management
        </h4>
        <div class="input-group mb-3">
          <span class="input-group-text bg-light"><i class="fa-solid fa-search text-muted"></i></span>
          <input type="text" id="searchVisitor" placeholder="Search by Name, Phone, or ID..." class="form-control" />
        </div>
        <div class="table-responsive rounded shadow-sm">
          <table class="table table-hover table-striped align-middle" id="visitorTable">
            <thead class="table-light sticky-top">
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Last Entry</th>
                <th>Latest Exit/Status</th>
                <th>Blacklisted</th>
                <th>Full Details</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          <div id="emptyState" class="text-center py-5 d-none">
            <i class="fa-solid fa-user-slash fa-2x text-muted mb-2"></i>
            <div class="text-muted">No visitors found.</div>
          </div>
        </div>
        <div id="visitorDetailsModalContainer"></div>
      </div>
    `;

    renderVisitorTable(allVisitorsData);

    // Search functionality
    const searchInput = document.getElementById("searchVisitor");
    if (searchInput) {
      searchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase().trim();
        const filteredVisitors = allVisitorsData.filter((visitor) => {
          const matchesName = visitor.name.toLowerCase().includes(searchTerm);
          const matchesPhone =
            visitor.phone && visitor.phone.toLowerCase().includes(searchTerm);
          return matchesName || matchesPhone;
        });
        renderVisitorTable(filteredVisitors);
      });
    }

    // View details button
    const visitorTable = document.getElementById("visitorTable");
    if (visitorTable) {
      visitorTable.addEventListener("click", async (event) => {
        if (event.target.closest(".view-visitor-btn")) {
          const btn = event.target.closest(".view-visitor-btn");
          const visitorId = btn.dataset.id;
          if (visitorId) {
            showLoading(content);
            try {
              const visitorDetails = await VisitorService.fetchVisitorData(
                visitorId
              );
              const modalContainer = document.getElementById(
                "visitorDetailsModalContainer"
              );
              showVisitorDetailModal(visitorDetails, modalContainer);
            } catch (error) {
              console.error("Error fetching visitor details:", error);
              showAlert(
                content,
                `Failed to load visitor details: ${error.message}`,
                "danger"
              );
            } finally {
              hideLoading();
            }
          }
        }
      });
    }
  } catch (e) {
    console.error("Failed to load visitor management data:", e);
    showAlert(
      content,
      "Failed to load visitor management data. Please try again.",
      "danger"
    );
  } finally {
    hideLoading();
  }
}
