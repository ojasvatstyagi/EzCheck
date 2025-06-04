(function () {
  const content = document.getElementById("role-content");
  if (!content) return;

  const mockVisits = [
    {
      date: "2025-06-01",
      purpose: "Meeting with HR",
      status: "Approved",
    },
    {
      date: "2025-05-20",
      purpose: "Site Tour",
      status: "Completed",
    },
  ];

  let visitRows = mockVisits
    .map(
      (visit) => `
    <tr>
      <td>${visit.date}</td>
      <td>${visit.purpose}</td>
      <td>
        <span class="badge bg-${
          visit.status === "Approved"
            ? "success"
            : visit.status === "Completed"
            ? "secondary"
            : "warning"
        }">${visit.status}</span>
      </td>
    </tr>
  `
    )
    .join("");

  content.innerHTML = `
    <div class="card shadow rounded-4 p-4">
      <h4>Welcome, Visitor!</h4>
      <p class="text-muted">Here are your recent visits to our facility.</p>

      <div class="table-responsive mt-4">
        <table class="table table-bordered table-striped">
          <thead class="table-dark">
            <tr>
              <th>Date</th>
              <th>Purpose</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${visitRows}
          </tbody>
        </table>
      </div>

      <p class="mt-4">Need to modify a visit or book a new one? Please contact the front desk or email your company host.</p>
    </div>
  `;
})();
