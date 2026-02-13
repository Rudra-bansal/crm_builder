import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [alerts, setAlerts] = useState(null);

  const [globalSearch, setGlobalSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Projects", path: "/projects", icon: "🏗️" },
    { name: "Leads", path: "/leads", icon: "📞" },
    { name: "Inventory", path: "/inventory", icon: "🏠" },
    { name: "Bookings", path: "/bookings", icon: "💰" },
    { name: "Payments", path: "/payments", icon: "💳" },
    { name: "Finance", path: "/finance", icon: "📑" },
    { name: "Expenses", path: "/expenses", icon: "💸" },
    { name: "Profit", path: "/profit", icon: "📈" },
  ];

  const fetchAlerts = async () => {
    try {
      const res = await axiosInstance.get("/dashboard/followup-alerts");

      setAlerts(res.data);
      setNotificationCount(res.data.todayCount + res.data.overdueCount);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-indigo-50 via-sky-50 to-cyan-50">
      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-indigo-700 to-blue-700 text-white shadow-lg flex flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-72"
          }`}
      >
        {/* Brand */}
        <div className="p-6 border-b border-white/20 flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">
                Builder CRM
              </h1>
              <p className="text-sm text-white/70 mt-1">
                Smart Real Estate Manager
              </p>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-white/20 transition"
          >
            {collapsed ? "➡️" : "⬅️"}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive
                  ? "bg-white/20 text-white shadow"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-5 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition"
          >
            {collapsed ? "🚪" : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white/70 backdrop-blur-md shadow-sm px-6 py-4 flex justify-between items-center relative border-b border-gray-200 z-50">
          {/* Search Bar */}
          <div className="flex items-center gap-3 w-full max-w-md bg-white/70 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-gray-500">🔍</span>

            <input
              type="text"
              placeholder="Search leads, projects, units..."
              className="bg-transparent outline-none w-full text-gray-700"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/leads?search=${globalSearch}`);
                  setGlobalSearch("");
                }
              }}
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6 ml-6 relative">
            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-white/60 transition"
            >
              🔔

              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 rounded-full">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showNotifications && alerts && (
              <div className="absolute right-0 top-14 w-96 bg-white/90 backdrop-blur-md shadow-xl rounded-xl border border-gray-200 p-4 z-[9999]">
                <h2 className="text-lg font-bold mb-2 text-gray-800">
                  Notifications
                </h2>

                {/* Today */}
                <div className="mb-4">
                  <p className="font-semibold text-yellow-700">
                    Today Follow-ups ({alerts.todayCount})
                  </p>

                  {alerts.todayFollowups.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No follow-ups scheduled today.
                    </p>
                  ) : (
                    <div className="mt-2 space-y-2">
                      {alerts.todayFollowups.slice(0, 3).map((lead) => (
                        <div
                          key={lead._id}
                          className="p-2 border border-gray-200 rounded-lg hover:bg-yellow-50 cursor-pointer transition"
                          onClick={() => {
                            setShowNotifications(false);
                            navigate(`/leads/${lead._id}`);
                          }}
                        >
                          <p className="font-semibold text-gray-800">
                            {lead.name}
                          </p>
                          <p className="text-xs text-gray-500">{lead.phone}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Overdue */}
                <div>
                  <p className="font-semibold text-red-700">
                    Overdue Follow-ups ({alerts.overdueCount})
                  </p>

                  {alerts.overdueFollowups.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No overdue follow-ups 🎉
                    </p>
                  ) : (
                    <div className="mt-2 space-y-2">
                      {alerts.overdueFollowups.slice(0, 3).map((lead) => (
                        <div
                          key={lead._id}
                          className="p-2 border border-gray-200 rounded-lg hover:bg-red-50 cursor-pointer transition"
                          onClick={() => {
                            setShowNotifications(false);
                            navigate(`/leads/${lead._id}`);
                          }}
                        >
                          <p className="font-semibold text-gray-800">
                            {lead.name}
                          </p>
                          <p className="text-xs text-gray-500">{lead.phone}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-semibold"
                  onClick={() => {
                    setShowNotifications(false);
                    navigate("/dashboard");
                  }}
                >
                  View Dashboard
                </button>
              </div>
            )}

            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-full font-bold shadow">
                {user?.name ? user.name[0].toUpperCase() : "U"}
              </div>

              <div className="hidden md:block">
                <p className="font-semibold text-gray-800">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  Role: {user?.role || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

