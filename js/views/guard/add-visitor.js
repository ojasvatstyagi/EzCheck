import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";
import { registerVisitor, requestVisit } from "../../../api/visitorApi.js"; // You need to implement these

export default function initAddVisitorView() {
  const content = document.getElementById("role-content");
  if (!content) return;
  content.innerHTML = `
    <div class="container mt-4">
      <div class="card">
        <div class="card-header">
          <h3>Register New Walk-in Visitor & Request Visit</h3>
        </div>
        <div class="card-body">
          <form id="walkin-form">
            <h5 class="mb-3">Visitor Information</h5>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="fullName" class="form-label">Full Name</label>
                <input type="text" id="fullName" name="fullName" class="form-control" required />
              </div>
              <div class="col-md-6 mb-3">
                <label for="phone" class="form-label">Phone Number</label>
                <input type="tel" id="phone" name="phone" class="form-control" required />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="email" class="form-label">Email Address</label>
                <input type="email" id="email" name="email" class="form-control" />
              </div>
              <div class="col-md-6 mb-3">
                <label for="company" class="form-label">Company</label>
                <input type="text" id="company" name="company" class="form-control" />
              </div>
            </div>
            <div class="mb-3">
              <label for="idNumber" class="form-label">ID Number</label>
              <input type="text" id="idNumber" name="idNumber" class="form-control" />
            </div>
            <hr>
            <h5 class="mb-3">Visit Information</h5>
            <div class="mb-3">
              <label class="form-label">Purpose of Visit</label>
              <select class="form-select" id="purpose" required>
                <option value="">Select purpose</option>
                <option value="Meeting">Meeting</option>
                <option value="Delivery">Delivery</option>
                <option value="Interview">Interview</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Host/Contact Person</label>
              <input type="text" id="host" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Visit Date</label>
              <input type="datetime-local" id="visitDate" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Additional Notes</label>
              <textarea class="form-control" id="notes" rows="3"></textarea>
            </div>
            <div class"d-flex align-items-center">
              <button type="submit" class="btn btn-outline-primary-custom">Register & Request Visit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  document
    .getElementById("walkin-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      showLoading(content);

      // Gather visitor info
      const visitorData = {
        name: document.getElementById("fullName").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        company: document.getElementById("company").value,
        idNumber: document.getElementById("idNumber").value,
      };

      // Gather visit info
      const visitData = {
        purpose: document.getElementById("purpose").value,
        host: document.getElementById("host").value,
        visitDate: document.getElementById("visitDate").value,
        notes: document.getElementById("notes").value,
      };

      try {
        // 1. Register visitor (implement registerVisitor to return visitorId)
        const visitorId = await registerVisitor(visitorData);

        // 2. Request visit for this visitor
        await requestVisit(visitorId, visitData);

        showAlert(
          content,
          "Visitor registered and visit requested!",
          "success"
        );
        e.target.reset();
      } catch (error) {
        showAlert(
          content,
          "Failed to register visitor or request visit.",
          "danger"
        );
      } finally {
        hideLoading();
      }
    });
}
