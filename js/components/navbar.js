// js/components/navbar.js
export function renderNavbar(role) {
  const navConfig = {
    admin: [
      { icon: "fa-tachometer-alt", text: "Dashboard", page: "dashboard" },
      { icon: "fa-users", text: "Visitors", page: "visitors" },
      { icon: "fa-ban", text: "Blacklist", page: "blacklist" },
      { icon: "fa-chart-bar", text: "Reports", page: "reports" },
    ],
    host: [
      { icon: "fa-tachometer-alt", text: "Dashboard", page: "dashboard" },
      { icon: "fa-user-plus", text: "Register", page: "register" },
      { icon: "fa-history", text: "History", page: "history" },
    ],
    guard: [{ icon: "fa-qrcode", text: "Scan", page: "scan" }],
    visitor: [
      { icon: "fa-id-card", text: "My Dashboard", page: "visitor-dashboard" },
    ],
  };

  const navbar = document.getElementById("navbar-container");
  navbar.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <i class="fas fa-building me-2"></i>VMS
        </a>
        
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

  // Add logout functionality
  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "index.html";
  });

  // Add navigation handlers
  document.querySelectorAll("[data-page]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      loadPage(e.target.closest("a").dataset.page);
    });
  });
}

async function loadPage(page) {
  const roleContent = document.getElementById("role-content");
  roleContent.innerHTML = ""; // Clear content area

  try {
    switch (page) {
      case "dashboard":
        const { default: initDashboard } = await import("../views/admin.js");
        initDashboard();
        break;
      case "visitors":
        const { default: initVisitorManagement } = await import(
          "../views/admin/visitorManagement.js"
        );
        initVisitorManagement();
        break;
      case "blacklist":
        const { default: initBlacklistManagement } = await import(
          "../views/admin/blacklistManagement.js"
        );
        initBlacklistManagement();
        break;
      case "reports":
        const { default: initReports } = await import(
          "../views/admin/reporting.js"
        );
        initReports();
        break;
      case "visitor-dashboard":
        // Import the main visitor view, not the addPass module
        const { default: initVisitorView } = await import(
          "../views/visitor.js"
        );
        initVisitorView();
        break;
      case "register":
        // Add host register page
        const { default: initHostRegister } = await import(
          "../views/host/register.js"
        );
        initHostRegister();
        break;
      case "history":
        // Add host history page
        const { default: initHostHistory } = await import(
          "../views/host/history.js"
        );
        initHostHistory();
        break;
      case "scan":
        // Add guard scan page
        const { default: initGuardScan } = await import(
          "../views/guard/scan.js"
        );
        initGuardScan();
        break;
      default:
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
