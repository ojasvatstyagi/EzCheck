(function () {
  const content = document.getElementById("role-content");
  if (!content) return;

  const guardName = sessionStorage.getItem("username") || "Guard";

  content.innerHTML = `
    <div class="container">
      <div class="card shadow rounded-4 p-4 mb-4">
        <h4 class="mb-2">Welcome, ${guardName}</h4>
        <p class="text-muted">You are responsible for verifying and checking in visitors at the gate.</p>
      </div>

      <div class="row g-4">
        <div class="col-md-6">
          <div class="card border-dark rounded-4 p-3 h-100">
            <h5 class="mb-2">Check-In Visitors</h5>
            <p>Verify ID and approve entry for registered visitors.</p>
            <button class="btn btn-dark mt-2" disabled>Start Check-In</button> <!-- Future -->
          </div>
        </div>

        <div class="col-md-6">
          <div class="card border-dark rounded-4 p-3 h-100">
            <h5 class="mb-2">Today's Visitors</h5>
            <p>View the list of visitors expected to arrive today (Coming soon).</p>
            <button class="btn btn-outline-secondary mt-2" disabled>View List</button>
          </div>
        </div>
      </div>
    </div>
  `;
})();
