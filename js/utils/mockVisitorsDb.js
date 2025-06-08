// js/utils/mockVisitorsDb.js
let mockVisitorsDb = JSON.parse(localStorage.getItem("mock_visitors") || "[]");
let mockVisitsDb = JSON.parse(localStorage.getItem("mock_visits") || "[]");

function saveMockData() {
  localStorage.setItem("mock_visitors", JSON.stringify(mockVisitorsDb));
  localStorage.setItem("mock_visits", JSON.stringify(mockVisitsDb));
}

if (mockVisitorsDb.length === 0) {
  mockVisitorsDb = [
    {
      id: "vis1",
      name: "Alice Smith",
      email: "alice.smith@example.com",
      phone: "9876543210", // Matches blocked1@example.com
      idNumber: "AS12345",
      company: "Tech Solutions",
      photo: null,
      idProof: null,
      registrationDate: new Date().toISOString(),
      isBlocked: false, // Explicitly set initial blocked status
    },
    {
      id: "vis2",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      phone: "1122334455", // Matches blocked3@example.com
      idNumber: "BJ67890",
      company: "Global Innovations",
      photo: null,
      idProof: null,
      registrationDate: new Date().toISOString(),
      isBlocked: false, // Explicitly set initial blocked status
    },
    {
      id: "vis3",
      name: "Charlie Brown",
      email: "charlie.b@example.com",
      phone: "5551234567",
      idNumber: "CB98765",
      company: "Creative Minds",
      photo: null,
      idProof: null,
      registrationDate: new Date().toISOString(),
      isBlocked: false, // Explicitly set initial blocked status
    },
  ];
  saveMockData(); // Save initial mock data to localStorage
}

// You might also want to initialize mockVisitsDb if it's typically empty or needs default visits
if (mockVisitsDb.length === 0) {
  mockVisitsDb = [
    // Example: a pending visit for Charlie Brown
    {
      id: "VISIT-mock1",
      visitorId: "vis3", // Charlie Brown's ID
      purpose: "Meeting",
      host: "Jane Doe",
      visitDate: "2025-06-09T10:00:00.000Z",
      notes: "Discussion on project Alpha",
      status: "Pending",
      requestDate: new Date(2025, 5, 8, 9, 0, 0).toISOString(),
      checkInTime: null,
      checkOutTime: null,
    },
    // Example: a completed visit for Alice Smith
    {
      id: "VISIT-mock2",
      visitorId: "vis1", // Alice Smith's ID
      purpose: "Interview",
      host: "John Smith",
      visitDate: "2025-06-07T14:30:00.000Z",
      notes: "Follow-up interview",
      status: "Completed",
      requestDate: new Date(2025, 5, 6, 10, 0, 0).toISOString(),
      checkInTime: new Date(2025, 5, 7, 14, 25, 0).toISOString(),
      checkOutTime: new Date(2025, 5, 7, 15, 30, 0).toISOString(),
    },
  ];
  saveMockData(); // Save initial mock visits to localStorage
}

// Export the in-memory databases and the save function
// These will be used by other parts of the API
export { mockVisitorsDb, mockVisitsDb, saveMockData };
