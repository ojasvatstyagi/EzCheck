document.getElementById("visitorForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const purpose = formData.get("purpose");
  const photoFile = formData.get("photo");
  const idFile = formData.get("idProof");

  if (!/^\d{10}$/.test(phone)) {
    alert("Please enter a valid 10-digit phone number.");
    return;
  }

  try {
    const [photoRes, idRes] = await Promise.all([
      VisitorAPI.uploadFile(photoFile),
      VisitorAPI.uploadFile(idFile),
    ]);

    const newVisitor = {
      name,
      email,
      phone,
      purpose,
      photoUrl: photoRes.url,
      idUrl: idRes.url,
      timestamp: new Date().toISOString(),
    };

    const result = await VisitorAPI.registerVisitor(newVisitor);
    if (result.success) {
      // Build QR payload
      const qrPayload = {
        visitorId: result.id,
        name,
        purpose,
        time: newVisitor.timestamp,
      };

      // Show QR Code
      const qrContainer = document.getElementById("qrCode");
      qrContainer.innerHTML = ""; // clear previous if any
      new QRCode(qrContainer, {
        text: JSON.stringify(qrPayload),
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });

      // Show modal
      const qrModal = new bootstrap.Modal(document.getElementById("qrModal"));
      qrModal.show();

      form.reset();
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong while registering.");
  }
});
