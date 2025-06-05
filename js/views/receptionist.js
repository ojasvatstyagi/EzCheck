(function () {
  const content = document.getElementById("role-content");
  if (!content) return;

  const hostName = sessionStorage.getItem("username") || "Host";

  content.innerHTML = `
    <div class="container">
      <div class="card shadow rounded-4 p-4 mb-4">
        <h4 class="mb-2">Welcome, ${hostName}</h4>
        <p class="text-muted">Register new visitors, manage appointments, and assist walk-ins.</p>
      </div>

      <div class="row g-4">
        <div class="col-md-6">
          <div class="card border-dark rounded-4 p-3 h-100">
            <h5 class="mb-2">Register New Visitor</h5>
            <p>Fill out the visitor form and upload their ID/photo before check-in.</p>
            <a href="visitor-form.html" class="btn btn-dark mt-2">Register Visitor</a>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card border-dark rounded-4 p-3 h-100">
            <h5 class="mb-2">Manage Appointments</h5>
            <p>Check or edit scheduled appointments (Coming Soon).</p>
            <button class="btn btn-outline-secondary mt-2" disabled>View Appointments</button>
          </div>
        </div>
      </div>
    </div>
  `;
})();
