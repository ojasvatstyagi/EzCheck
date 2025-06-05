import { setupPhotoUploadListener } from "./photoUpload.js";
import { setupIdUploadListener } from "./idUpload.js";

export function initProfileView(visitorData) {
  if (!visitorData) {
    return `<div class="alert alert-danger">Failed to load visitor data</div>`;
  }

  return `
    <div class="card shadow-sm h-100">
      <div class="card-header bg-dark text-white">
        <h5 class="mb-0">My Profile</h5>
      </div>
      <div class="card-body text-center">
        <img src="${
          visitorData.photo ||
          "https://cdn2.iconfinder.com/data/icons/data-analytics-1-2/48/51-128.png"
        }"
             class="rounded-circle mb-3"
             width="120" height="120"
             alt="Visitor Photo"
             title="Visitor Photo"
             id="visitorPhoto" />

        <h4>${visitorData.name || "Name Not Available"}</h4>
        <p class="text-muted">${
          visitorData.company || "No company specified"
        }</p>

        <div class="d-grid gap-2 mt-3">
          <button class="btn btn-outline-primary" id="uploadPhotoBtn">
            <i class="fas fa-camera me-2"></i> Update Photo
          </button>
          <button class="btn btn-outline-secondary" id="uploadIdBtn">
            <i class="fas fa-id-card me-2"></i> Upload ID Proof
          </button>
        </div>
      </div>
    </div>
  `;

  setupPhotoUploadListener(visitorData._id, () =>
    renderVisitorProfile(visitorData)
  );
  setupIdUploadListener(visitorData._id, () =>
    renderVisitorProfile(visitorData)
  );
}
