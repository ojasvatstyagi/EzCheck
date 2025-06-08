// js/utils/mockBlacklistDb.js
let mockVisitorsDb = JSON.parse(localStorage.getItem("mock_visitors") || "[]");
let mockVisitsDb = JSON.parse(localStorage.getItem("mock_visits") || "[]");

// Define the blacklist database as a constant export
export const mockBlacklistDb = [
  {
    id: "bl1",
    name: "Blocked Person One",
    email: "blocked1@example.com",
    idNumber: "ID001",
    mobile: "9876543210", // This mobile matches Alice Smith's phone
    reason: "Security concern",
    addedOn: new Date(2023, 0, 15).toISOString(),
  },
  {
    id: "bl2",
    name: "Another Blocked",
    email: "blocked2@example.com",
    idNumber: "ID002",
    mobile: "1234567890",
    reason: "Past incident",
    addedOn: new Date(2023, 2, 20).toISOString(),
  },
  {
    id: "bl3",
    name: "Persona Non Grata",
    email: "blocked3@example.com",
    idNumber: "ID003",
    mobile: "1122334455", // This mobile matches Bob Johnson's phone
    reason: "Policy violation",
    addedOn: new Date(2023, 5, 1).toISOString(),
  },
];

// Helper function to save current in-memory data to localStorage
function saveMockData() {
  localStorage.setItem("mock_visitors", JSON.stringify(mockVisitorsDb));
  localStorage.setItem("mock_visits", JSON.stringify(mockVisitsDb));
}
