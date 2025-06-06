export default function initTodayVisitReport() {
  const content = document.getElementById("role-content");
  if (!content) return;
  content.innerHTML = `
    <div class="card shadow-sm">
      <div class="card-header bg-light text-white">
        <h2 class="mb-0 text-dark">Today's Schedule</h2>
      </div>
      <div class="card-body">
        <div class="input-group mb-3 d-flex justify-content-end ">
          <input type="text" class="form-control form-control-sm w-25 ms-auto" placeholder="Search visitors..." id="visitor-search">
        </div>
        <div class="nav nav-tabs" id="visits-tab" role="tablist">
          <button class="nav-link active text-primary-custom" id="expected-tab" data-bs-toggle="tab" data-bs-target="#tab-expected" type="button" role="tab" aria-controls="tab-expected" aria-selected="true">Expected</button>
          <button class="nav-link text-primary-custom" id="checked-in-tab" data-bs-toggle="tab" data-bs-target="#tab-checked-in" type="button" role="tab" aria-controls="tab-checked-in" aria-selected="false">Checked In</button>
          <button class="nav-link text-primary-custom" id="completed-tab" data-bs-toggle="tab" data-bs-target="#tab-completed" type="button" role="tab" aria-controls="tab-completed" aria-selected="false">Completed</button>
        </div>
        <div class="tab-content" id="visits-tabContent">
          <div class="tab-pane fade show active" id="tab-expected" role="tabpanel" aria-labelledby="expected-tab">
            <div id="expected-visits-list">
              <div class="no-visits text-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mt-4 text-gray-300">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" x2="16" y1="2" y2="6"></line>
                  <line x1="8" x2="8" y1="2" y2="6"></line>
                  <line x1="3" x2="21" y1="10" y2="10"></line>
                </svg>
                <p>No expected visitors for today.</p>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="tab-checked-in" role="tabpanel" aria-labelledby="checked-in-tab">
            <div id="checked-in-visits-list">
              <div class="no-visits text-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mt-4 text-gray-300">
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
                <p>No checked-in visitors.</p>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="tab-completed" role="tabpanel" aria-labelledby="completed-tab">
            <div id="completed-visits-list">
              <div class="no-visits text-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mt-4 text-gray-300">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <p>No completed visits for today.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
