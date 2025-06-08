// js/views/visitor/visitCancel.js
import VisitorService from "../../../api/visitorApi.js";
import { showAlert, showLoading, hideLoading } from "../../utils/helpers.js";

export async function handleVisitCancellation(visitorId, onSuccess) {
  if (confirm("Are you sure you want to cancel this visit request?")) {
    try {
      showLoading();
      await VisitorService.cancelVisit(visitorId);
      showAlert(document.body, "Visit request cancelled", "success");

      // Call the success callback to refresh the view
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      showAlert(
        document.body,
        "Failed to cancel visit: " + error.message,
        "danger"
      );
    } finally {
      hideLoading();
    }
  }
}

export function setupVisitCancelListener(visitorId, onSuccess) {
  document
    .getElementById("cancelVisitBtn")
    ?.addEventListener("click", async () => {
      await handleVisitCancellation(visitorId, onSuccess);
    });
}
