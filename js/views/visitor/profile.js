// js/views/visitor/profile.js

export function initProfileView(visitorData, isEditing = false) {
  if (!visitorData) {
    return `<div class="alert alert-danger">Failed to load visitor data</div>`;
  }

  const defaultPhoto =
    "https://img.freepik.com/premium-vector/stylish-default-user-profile-photo-avatar-vector-illustration_664995-353.jpg?semt=ais_hybrid&w=740";

  if (isEditing) {
    return `
      <div class="card shadow-sm h-100">
        <div class="card-header bg-light text-dark">
          <h5 class="mb-0">Edit Profile</h5>
        </div>
        <div class="card-body text-center">
          <img src="${visitorData.photo || defaultPhoto}"
               class="rounded-circle mb-3"
               width="120" height="120"
               alt="Visitor Photo"
               title="Visitor Photo"
               id="visitorPhoto" />

          <div class="d-grid gap-2 mt-3 mb-4">
            <button class="btn btn-outline-primary-custom" id="uploadPhotoBtn">
              <i class="fas fa-camera me-1"></i> Update Photo
            </button>
          </div>

          <form id="profileEditForm">
            <div class="mb-3 text-start">
              <label for="profileName" class="form-label">Name</label>
              <input type="text" class="form-control" id="profileName" value="${
                visitorData.name || ""
              }" required>
            </div>
            <div class="mb-3 text-start">
              <label for="profileEmail" class="form-label">Email</label>
              <input type="email" class="form-control" id="profileEmail" value="${
                visitorData.email || ""
              }" required>
            </div>
            <div class="mb-3 text-start">
              <label for="profilePhone" class="form-label">Phone</label>
              <input type="tel" class="form-control" id="profilePhone" value="${
                visitorData.phone || ""
              }" required>
            </div>
            <div class="mb-3 text-start">
              <label for="profileCompany" class="form-label">Company</label>
              <input type="text" class="form-control" id="profileCompany" value="${
                visitorData.company || ""
              }">
            </div>
            <div class="mb-3 text-start">
              <label for="profileIdNumber" class="form-label">ID Number</label>
              <input type="text" class="form-control" id="profileIdNumber" value="${
                visitorData.idNumber || ""
              }">
            </div>
            <div class="d-grid gap-2 mt-4">
              <button type="submit" class="btn btn-outline-success" id="saveProfileBtn">
                <i class="fas fa-save me-2"></i> Save Changes
              </button>
              <button type="button" class="btn btn-outline-danger" id="cancelEditBtn">
                <i class="fas fa-times me-2"></i> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  } else {
    return `
      <div class="card shadow-sm h-100">
        <div class="card-header bg-light text-dark">
          <h5 class="mb-0">My Profile</h5>
        </div>
        <div class="card-body text-center">
          <img src="${visitorData.photo || defaultPhoto}"
               class="rounded-circle mb-3"
               width="120" height="120"
               alt="Visitor Photo"
               title="Visitor Photo"
               id="visitorPhoto" />

          <h4>${visitorData.name || "Name Not Available"}</h4>
          <p class="text-muted">${
            visitorData.company || "No company specified"
          }</p>

          <ul class="list-group list-group-flush text-start mb-3">
            <li class="list-group-item"><i class="fas fa-envelope me-2 text-dark"></i> ${
              visitorData.email || "Not provided"
            }</li>
            <li class="list-group-item"><i class="fas fa-phone me-2 text-dark"></i> ${
              visitorData.phone || "Not provided"
            }</li>
            <li class="list-group-item"><i class="fas fa-id-card me-2 text-dark"></i> ${
              visitorData.idNumber || "Not provided"
            }</li>
          </ul>

          <div class="d-grid gap-2 mt-3">
            <button class="btn btn-outline-primary-custom" id="uploadPhotoBtn">
              <i class="fas fa-camera me-2"></i> Update Photo
            </button>
            <button class="btn btn-outline-secondary" id="uploadIdBtn">
              <i class="fas fa-id-card me-2"></i> Upload ID Proof
            </button>
            <button class="btn btn-outline-primary mt-2" id="editProfileBtn">
              <i class="fas fa-edit me-2"></i> Edit Profile
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
