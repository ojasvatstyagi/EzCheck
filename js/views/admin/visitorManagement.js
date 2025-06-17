// js/views/admin/visitorManagement.js

import VisitorService from "../../../api/visitorApi.js";
import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";
import { showVisitorDetailModal } from "./visitorDetailModal.js";

let allVisitorsData = [];

function renderVisitorTable(visitorsToDisplay) {
  const tableBody = document.querySelector("#visitorTable tbody");
  if (!tableBody) return;

  tableBody.innerHTML = `
    ${
      visitorsToDisplay.length > 0
        ? visitorsToDisplay
            .map((v) => {
              const latestVisit = v.latestVisit;
              const entryTime = latestVisit
                ? new Date(latestVisit.checkInTime).toLocaleString()
                : "-";
              let exitTime = "-";
              if (latestVisit && latestVisit.checkOutTime) {
                exitTime = new Date(latestVisit.checkOutTime).toLocaleString();
              } else if (latestVisit && latestVisit.status === "Checked-In") {
                exitTime = "Inside";
              }
              return `
                <tr>
                    <td>${v.name}</td>
                    <td>${v.phone || "-"}</td>
                    <td>${entryTime}</td>
                    <td>${exitTime}</td>
                    <td>${
                      v.isBlocked
                        ? '<span class="badge bg-danger">Yes</span>'
                        : '<span class="badge bg-success">No</span>'
                    }</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary-custom view-visitor-btn" data-id="${
                          v.id
                        }">View</button>
                    </td>
                </tr>`;
            })
            .join("")
        : `<tr><td colspan="7" class="text-center">No visitors found.</td></tr>`
    }
  `;
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

    content.innerHTML = `
      <h4 class="mb-4">Visitor Management</h4>
      <input type="text" id="searchVisitor" placeholder="Search by Name, or Phone..." class="form-control mb-3">
      <div class="table-responsive">
          <table class="table table-hover" id="visitorTable">
              <thead>
                  <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Last Entry</th>
                      <th>Latest Exit/Status</th>
                      <th>Blacklisted</th>
                      <th>Actions</th>
                  </tr>
              </thead>
              <tbody></tbody>
          </table>
      </div>
      <div id="visitorDetailsModalContainer"></div>
    `;

    renderVisitorTable(allVisitorsData);

    const searchInput = document.getElementById("searchVisitor");
    if (searchInput) {
      searchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase().trim();
        const filteredVisitors = allVisitorsData.filter((visitor) => {
          const matchesName = visitor.name.toLowerCase().includes(searchTerm);
          const matchesPhone =
            visitor.phone && visitor.phone.toLowerCase().includes(searchTerm);
          const matchesId =
            visitor.idNumber &&
            visitor.idNumber.toLowerCase().includes(searchTerm);
          return matchesName || matchesPhone || matchesId;
        });
        renderVisitorTable(filteredVisitors);
      });
    }

    const visitorTable = document.getElementById("visitorTable");
    if (visitorTable) {
      visitorTable.addEventListener("click", async (event) => {
        if (event.target.classList.contains("view-visitor-btn")) {
          const visitorId = event.target.dataset.id;
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
