export default async function loadHostView() {
  const content = document.getElementById("role-content");
  if (!content) return;

  content.innerHTML = `
    <div class="app-layout">
      <main class="main-content">
        <div id="section-dashboard" class="section-content">
          <div class="host-dashboard">
  
            <div class="pending-requests">
              <div class="requests-header">
                <h2 class="requests-title">Pending Requests</h2>
                <a href="#" data-section="requests" class="btn btn-sm btn-link-custom">View All</a>
              </div>
              <div class="requests-body" id="pending-requests-container">
                <div class="no-requests">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray-300">
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                  </svg>
                  <p>You don't have any pending visit requests.</p>
                </div>
              </div>
            </div>
            
            <div class="upcoming-visits">
              <div class="visits-header">
                <h2 class="requests-title">Today's Visits</h2>
                <a href="#" data-section="calendar" class="btn btn-sm btn-link-custom">View Calendar</a>
              </div>
              <div class="visits-body" id="today-visits-container">
                <div class="no-visits">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray-300">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                    <line x1="16" x2="16" y1="2" y2="6"></line>
                    <line x1="8" x2="8" y1="2" y2="6"></line>
                    <line x1="3" x2="21" y1="10" y2="10"></line>
                  </svg>
                  <p>You don't have any visits scheduled for today.</p>
                </div>
              </div>
            </div>
            
            <div class="upcoming-visits mt-6">
              <div class="visits-header">
                <h2 class="requests-title">Upcoming Visits</h2>
              </div>
              <div class="visits-body">
                <div class="visit-list" id="upcoming-visits-container">
                  <!-- Upcoming visits will be loaded here -->
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  `;
}
