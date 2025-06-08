export const navConfig = {
  admin: [
    { icon: "fa-tachometer-alt", text: "Dashboard", page: "admin" },
    { icon: "fa-users", text: "Visitors", page: "visitors" },
    { icon: "fa-ban", text: "Blacklist", page: "blacklist" },
    { icon: "fa-chart-bar", text: "Reports", page: "reports" },
  ],
  host: [
    { icon: "fa-tachometer-alt", text: "Dashboard", page: "host" },
    { icon: "fa-user-plus", text: "Add Visitor", page: "addVisitor" },
    { icon: "fa-history", text: "History", page: "history" },
  ],
  guard: [{ icon: "fa-qrcode", text: "Dashboard", page: "guard" }],
  visitor: [{ icon: "fa-id-card", text: "Dashboard", page: "visitor" }],
};
