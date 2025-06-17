// js/views/admin/userManagement.js

import UserService from "../../../api/userService.js";
import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";

function createUserModal(user = {}) {
  const isEdit = !!user.id;
  const modalTitle = isEdit ? "Edit User" : "Add New User";
  const submitButtonText = isEdit ? "Update User" : "Add User";

  return `
    <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="userModalLabel">${modalTitle}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="userForm">
              <input type="hidden" id="userId" value="${user.id || ""}">
              <div class="mb-3">
                <label for="userName" class="form-label">Name</label>
                <input type="text" class="form-control" id="userName" value="${
                  user.name || ""
                }" required>
              </div>
              <div class="mb-3">
                <label for="userPhone" class="form-label">Phone</label>
                <input type="tel" class="form-control" id="userPhone" value="${
                  user.phone || ""
                }" required>
              </div>
              <div class="mb-3">
                <label for="userPassword" class="form-label">${
                  isEdit
                    ? "New Password (leave blank to keep current)"
                    : "Password"
                }</label>
                <input type="password" class="form-control" id="userPassword" ${
                  isEdit ? "" : "required"
                }>
              </div>
              <div class="mb-3">
                <label for="userRole" class="form-label">Role</label>
                <select class="form-control" id="userRole" required>
                  <option value="admin" ${
                    user.role === "admin" ? "selected" : ""
                  }>Admin</option>
                  <option value="guard" ${
                    user.role === "guard" ? "selected" : ""
                  }>Guard</option>
                  <option value="host" ${
                    user.role === "host" ? "selected" : ""
                  }>Host</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" form="userForm" class="btn btn-outline-primary-custom">${submitButtonText}</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export default async function initUserManagement() {
  const content = document.getElementById("role-content");
  showLoading(content);

  try {
    const users = await UserService.fetchUsers();

    content.innerHTML = `
      <h4 class="mb-4">User Management</h4>
      <button class="btn btn-sm btn-outline-primary-custom mb-3" id="addUserBtn">Add New User</button>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${
              users.length > 0
                ? users
                    .map(
                      (user) => `
              <tr>
                <td>${user.name || "N/A"}</td>
                <td>${user.phone || "N/A"}</td>
                <td>${user.role || "N/A"}</td>
                <td>
                  <button class="btn btn-sm btn-outline-info edit-user-btn" data-id="${
                    user.id
                  }">Edit</button>
                  <button class="btn btn-sm btn-outline-danger delete-user-btn" data-id="${
                    user.id
                  }">Delete</button>
                </td>
              </tr>`
                    )
                    .join("")
                : `<tr><td colspan="4" class="text-center">No users found.</td></tr>`
            }
          </tbody>
        </table>
      </div>
      <div id="user-modals-container"></div>
    `;

    // Add User Button Click Handler
    document.getElementById("addUserBtn").addEventListener("click", () => {
      const modalsContainer = document.getElementById("user-modals-container");
      modalsContainer.innerHTML = createUserModal();

      const userModalElement = document.getElementById("userModal");
      const userModal = new bootstrap.Modal(userModalElement);
      userModal.show();

      const userForm = document.getElementById("userForm");
      const modalBody = userModalElement.querySelector(".modal-body");

      userForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("userName").value.trim();
        const phone = document.getElementById("userPhone").value.trim();
        const password = document.getElementById("userPassword").value.trim();
        const role = document.getElementById("userRole").value;

        if (!name || !phone || !password) {
          showAlert(
            modalBody,
            "Please fill in all required fields (Name, phone, Password).",
            "warning"
          );
          return;
        }

        showLoading(content);
        try {
          await UserService.createUser({ name, phone, password, role });
          showAlert(content, "User added successfully!", "success");
          userModal.hide();
          userModalElement.addEventListener(
            "hidden.bs.modal",
            function handler() {
              modalsContainer.innerHTML = "";
              userModalElement.removeEventListener("hidden.bs.modal", handler);
              initUserManagement(); // Re-render table
            }
          );
        } catch (error) {
          console.error("Error adding user:", error);
          showAlert(
            modalBody,
            `Failed to add user: ${error.message}`,
            "danger"
          );
        } finally {
          hideLoading();
        }
      });
    });

    // Event Listeners for Edit and Delete (delegated)
    document
      .querySelector("table tbody")
      .addEventListener("click", async (event) => {
        const userId = event.target.dataset.id;

        // Edit User
        if (event.target.classList.contains("edit-user-btn")) {
          const userToEdit = users.find((u) => u.id === userId);
          if (!userToEdit) {
            showAlert(content, "User not found for editing.", "danger");
            return;
          }

          const modalsContainer = document.getElementById(
            "user-modals-container"
          );
          modalsContainer.innerHTML = createUserModal(userToEdit);

          const userModalElement = document.getElementById("userModal");
          const userModal = new bootstrap.Modal(userModalElement);
          userModal.show();

          const userForm = document.getElementById("userForm");
          const modalBody = userModalElement.querySelector(".modal-body");

          userForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const updatedName = document
              .getElementById("userName")
              .value.trim();
            const updatedPhone = document
              .getElementById("userPhone")
              .value.trim();
            const updatedPassword = document
              .getElementById("userPassword")
              .value.trim();
            const updatedRole = document.getElementById("userRole").value;

            if (!updatedName || !updatedPhone) {
              showAlert(
                modalBody,
                "Please fill in all required fields (Name, Phone).",
                "warning"
              );
              return;
            }

            const updates = {
              name: updatedName,
              phone: updatedPhone,
              role: updatedRole,
            };
            if (updatedPassword) {
              // Only send password if it's not empty
              updates.password = updatedPassword;
            }

            showLoading(content);
            try {
              await UserService.updateUser(userId, updates);
              showAlert(content, "User updated successfully!", "success");
              userModal.hide();
              userModalElement.addEventListener(
                "hidden.bs.modal",
                function handler() {
                  modalsContainer.innerHTML = "";
                  userModalElement.removeEventListener(
                    "hidden.bs.modal",
                    handler
                  );
                  initUserManagement(); // Re-render table
                }
              );
            } catch (error) {
              console.error("Error updating user:", error);
              showAlert(
                modalBody,
                `Failed to update user: ${error.message}`,
                "danger"
              );
            } finally {
              hideLoading();
            }
          });
        }

        // Delete User
        if (event.target.classList.contains("delete-user-btn")) {
          if (
            confirm(
              "Are you sure you want to delete this user? This action cannot be undone."
            )
          ) {
            showLoading(content);
            try {
              await UserService.deleteUser(userId);
              showAlert(content, "User deleted successfully!", "success");
              initUserManagement(); // Re-render table
            } catch (error) {
              console.error("Error deleting user:", error);
              showAlert(
                content,
                `Failed to delete user: ${error.message}`,
                "danger"
              );
            } finally {
              hideLoading();
            }
          }
        }
      });
  } catch (e) {
    console.error("Failed to load user management:", e);
    showAlert(
      content,
      "Failed to load user management. Please try again.",
      "danger"
    );
  } finally {
    hideLoading();
  }
}
