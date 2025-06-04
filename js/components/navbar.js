function renderNavbar() {
  const role = sessionStorage.getItem("role") || "guest";
  const container = document.getElementById("navbar-container");

  if (!container) return;

  let navItems = `
    <li class="nav-item">
      <a class="nav-link" href="dashboard.html">Dashboard</a>
    </li>
  `;

  // Add role-specific items
  if (role === "admin") {
    navItems += `
      <li class="nav-item">
        <a class="nav-link" href="logs.html">Visitor Logs</a>
      </li>
    `;
  }

  if (role === "receptionist" || role === "guard") {
    navItems += `
      <li class="nav-item">
        <a class="nav-link" href="visitor-form.html">Register Visitor</a>
      </li>
    `;
  }

  const navbar = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">VisitorSys</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            ${navItems}
          </ul>

          <span class="navbar-text me-3 text-white">
            Role: ${role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
          <button class="btn btn-outline-light btn-sm" onclick="logout()">Logout</button>
        </div>
      </div>
    </nav>
  `;

  container.innerHTML = navbar;
}

function logout() {
  sessionStorage.clear();
  window.location.href = "index.html";
}
