import { navConfig } from "../utils/navConfig.js";

export function renderNavbar(role) {
  const navbar = document.getElementById("navbar-container");
  navbar.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <p class="navbar-brand mb-0"><i class="fas fa-building me-2"></i>VMS</p>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            ${navConfig[role]
              .map(
                (item) => `
                  <li class="nav-item">
                    <a class="nav-link" href="#" data-page="${item.page}">
                      <i class="fas ${item.icon} me-1"></i> ${item.text}
                    </a>
                  </li>
                `
              )
              .join("")}
          </ul>
          <div class="d-flex">
            <button id="logoutBtn" class="btn btn-outline-danger">
              <i class="fas fa-sign-out-alt me-1"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  `;

  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "index.html";
  });

  document.querySelectorAll("[data-page]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = e.target.closest("a").dataset.page;
      loadPage(page);
    });
  });
}

async function loadPage(page) {
  const roleContent = document.getElementById("role-content");
  roleContent.innerHTML = "";

  const pageMap = {
    admin: () => import("../views/admin.js"),
    visitors: () => import("../views/admin/visitorManagement.js"),
    blacklist: () => import("../views/admin/blacklistManagement.js"),
    host: () => import("../views/host.js"),
    visitor: () => import("../views/visitor.js"),
    guard: () => import("../views/guard.js"),
    users: () => import("../views/admin/userManagement.js"),
  };

  try {
    const loader = pageMap[page];
    if (loader) {
      const { default: init } = await loader();
      init();
    } else {
      roleContent.innerHTML = `
        <div class="alert alert-warning">
          <i class="fas fa-exclamation-triangle me-2"></i>
          Page "${page}" is not implemented yet.
        </div>
      `;
    }
  } catch (error) {
    console.error(`Failed to load page ${page}:`, error);
    roleContent.innerHTML = `
      <div class="alert alert-danger">
        <i class="fas fa-exclamation-circle me-2"></i>
        Failed to load page "${page}". Please try again.
      </div>
    `;
  }
}
