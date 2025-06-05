// js/api/visitorApi.js
const API_BASE = "https://api.yourvms.com/v1";

export async function fetchVisitors() {
  // In production:
  // const response = await fetch(`${API_BASE}/visitors`);
  // return await response.json();

  // Mock data for development
  return [
    {
      id: "vis1",
      name: "faltu Doe",
      company: "ABC Corp",
      host: "Jane Smith",
      checkInTime: new Date(2022, 10, 1, 10, 30, 0),
      checkOutTime: null,
      isVIP: false,
    },
    {
      id: "vis2",
      name: "Jane Doe",
      company: "XYZ Inc",
      host: "John Smith",
      checkInTime: new Date(2022, 10, 1, 11, 0, 0),
      checkOutTime: new Date(2022, 10, 1, 12, 0, 0),
      isVIP: true,
    },
    {
      id: "vis3",
      name: "Bob Doe",
      company: "PQR Ltd",
      host: "Jane Doe",
      checkInTime: new Date(2022, 10, 1, 10, 0, 0),
      checkOutTime: new Date(2022, 10, 1, 11, 0, 0),
      isVIP: false,
    },
  ];
}

export async function fetchBlacklist() {
  // Mock data
  return [
    {
      id: "bl1",
      name: "Blocked Person",
      idNumber: "ID123456",
      mobile: "9876543210",
      reason: "Security concern",
      addedOn: new Date(),
    },
    {
      id: "bl1",
      name: "Blocked Person",
      idNumber: "ID123456",
      mobile: "9876543210",
      reason: "Security concern",
      addedOn: new Date(),
    },
    {
      id: "bl1",
      name: "Blocked Person",
      idNumber: "ID123456",
      mobile: "9876543210",
      reason: "Security concern",
      addedOn: new Date(),
    },
    {
      id: "bl1",
      name: "Blocked Person",
      idNumber: "ID123456",
      mobile: "9876543210",
      reason: "Security concern",
      addedOn: new Date(),
    },
    {
      id: "bl1",
      name: "Blocked Person",
      idNumber: "ID123456",
      mobile: "9876543210",
      reason: "Security concern",
      addedOn: new Date(),
    },
    {
      id: "bl1",
      name: "Blocked Person",
      idNumber: "ID123456",
      mobile: "9876543210",
      reason: "Security concern",
      addedOn: new Date(),
    },
    {
      id: "bl1",
      name: "Blocked Person",
      idNumber: "ID123456",
      mobile: "9876543210",
      reason: "Security concern",
      addedOn: new Date(),
    },
  ];
}

export async function exportReport() {
  // Implement actual export API call
  return new Promise((resolve) => {
    setTimeout(resolve, 1500); // Simulate API delay
  });
}

// Sample API functions that need to be implemented
export async function fetchVisitorData(visitorId) {
  // In production, this would call your actual API
  return {
    id: visitorId,
    name: "faltu Doe",
    company: "ABC Corp",
    photo: null,
    currentVisit: {
      id: "visit123",
      purpose: "Quarterly Review Meeting",
      host: "Jane Smith (HR)",
      date: "2025-06-15T14:00:00",
      status: "Approved",
    },
    visitHistory: [
      {
        date: "2025-05-10T10:00:00",
        purpose: "Job Interview",
        host: "Michael Johnson",
        entryTime: "2025-05-10T09:55:00",
        exitTime: "2025-05-10T11:30:00",
        status: "Completed",
      },
      {
        date: "2025-04-20T14:00:00",
        purpose: "Client Meeting",
        host: "Emily Davis",
        entryTime: "2025-04-20T13:45:00",
        exitTime: "2025-04-20T15:15:00",
        status: "Approved",
      },
      {
        date: "2025-03-15T09:00:00",
        purpose: "Training Session",
        host: "John Smith",
        entryTime: "2025-03-15T08:30:00",
        exitTime: "2025-03-15T10:00:00",
        status: "Pending",
      },
      {
        date: "2025-02-05T16:00:00",
        purpose: "Conference Call",
        host: "Sarah Johnson",
        entryTime: "2025-02-05T15:30:00",
        exitTime: "2025-02-05T17:00:00",
        status: "Cancelled",
      },
      // ... more history items
    ],
  };
}

export async function requestVisit(visitorId, visitData) {
  // Implementation for visit request API call
}

export async function cancelVisit(visitorId) {
  // Implementation for visit cancellation
}

export async function uploadIdProof(visitorId, formData) {
  // Implementation for ID proof upload
}
