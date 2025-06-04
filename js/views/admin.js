(function () {
  const content = document.getElementById("role-content");
  if (!content) return;

  const adminName = sessionStorage.getItem("username") || "Admin";

  content.innerHTML = `
    <div class="container">
      <div class="card shadow rounded-4 p-4 mb-4">
        <h4 class="mb-2">Welcome, ${adminName} 👋</h4>
        <p class="text-muted">Manage the system, track visitor activity, and control user access.</p>
      </div>

      <div class="row g-4">
        <div class="col-md-6">
          <div class="card border-dark rounded-4 p-3 h-100">
            <h5 class="mb-2">Visitor Logs</h5>
            <p>View all visitor entries, export reports, and monitor suspicious activity.</p>
            <a href="logs.html" class="btn btn-dark mt-2">Go to Logs</a>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card border-dark rounded-4 p-3 h-100">
            <h5 class="mb-2">User Management</h5>
            <p>Manage users, assign roles, or deactivate accounts (Coming Soon).</p>
            <button class="btn btn-outline-secondary mt-2" disabled>Manage Users</button>
          </div>
        </div>
      </div>
    </div>
  `;
})();
