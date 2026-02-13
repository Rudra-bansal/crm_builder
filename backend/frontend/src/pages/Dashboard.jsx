import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState(null);

  const navigate = useNavigate();

  // Fetch Dashboard Overview Data
  const fetchOverview = async () => {
    try {
      const res = await axiosInstance.get("/api/dashboard/overview");
      setData(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load dashboard data");
    }
  };

  // Fetch Follow-up Alerts
  const fetchAlerts = async () => {
    try {
      const res = await axiosInstance.get("/api/dashboard/followup-alerts");
      setAlerts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOverview();
    fetchAlerts();
  }, []);

  if (!data) {
    return (
      <Layout>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-24 bg-gray-300 rounded"></div>
          <div className="h-24 bg-gray-300 rounded"></div>
        </div>
      </Layout>
    );
  }

  const leadChartData = [
    { name: "New", value: data.statusSummary.new },
    { name: "Follow-up", value: data.statusSummary.followup },
    { name: "Site Visit", value: data.statusSummary.siteVisit },
    { name: "Booked", value: data.statusSummary.booked },
    { name: "Lost", value: data.statusSummary.lost },
  ];

  const financeChartData = [
    { name: "Sales", value: data.totalSales },
    { name: "Received", value: data.totalReceived },
    { name: "Expense", value: data.totalExpense },
  ];

  const pieColors = ["#4f46e5", "#16a34a", "#dc2626"];

  return (
    <Layout>
      <div>
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Dashboard 🚀
            </h1>
            <p className="text-gray-600 mt-1">
              Builder CRM performance overview
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/leads"
              className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition shadow"
            >
              + Add Lead
            </Link>

            <Link
              to="/inventory"
              className="bg-green-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-green-700 transition shadow"
            >
              + Add Unit
            </Link>

            <Link
              to="/expenses"
              className="bg-red-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-red-700 transition shadow"
            >
              + Add Expense
            </Link>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
            <p className="text-gray-500 text-sm">Projects</p>
            <p className="text-3xl font-bold text-gray-900">
              {data.totalProjects}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
            <p className="text-gray-500 text-sm">Leads</p>
            <p className="text-3xl font-bold text-gray-900">
              {data.totalLeads}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
            <p className="text-gray-500 text-sm">Units</p>
            <p className="text-3xl font-bold text-gray-900">
              {data.totalUnits}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
            <p className="text-gray-500 text-sm">Sold Units</p>
            <p className="text-3xl font-bold text-gray-900">{data.soldUnits}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
            <p className="text-gray-500 text-sm">Total Sales</p>
            <p className="text-2xl font-extrabold text-indigo-700">
              ₹{data.totalSales.toLocaleString()}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
            <p className="text-gray-500 text-sm">Received</p>
            <p className="text-2xl font-extrabold text-green-700">
              ₹{data.totalReceived.toLocaleString()}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
            <p className="text-gray-500 text-sm">Due</p>
            <p className="text-2xl font-extrabold text-yellow-600">
              ₹{data.due.toLocaleString()}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
            <p className="text-gray-500 text-sm">Profit</p>
            <p className="text-2xl font-extrabold text-purple-700">
              ₹{data.profit.toLocaleString()}
            </p>
          </div>
        </div>

        {/* QUICK ACTION CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
            <h2 className="text-xl font-bold text-gray-900">📌 Quick Actions</h2>
            <p className="text-gray-600 text-sm mt-1">
              Manage your daily workflow faster
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/leads"
                className="bg-indigo-600 text-white py-2 rounded-xl text-center font-semibold hover:bg-indigo-700 transition"
              >
                View Leads
              </Link>

              <Link
                to="/projects"
                className="bg-blue-600 text-white py-2 rounded-xl text-center font-semibold hover:bg-blue-700 transition"
              >
                View Projects
              </Link>

              <Link
                to="/finance"
                className="bg-green-600 text-white py-2 rounded-xl text-center font-semibold hover:bg-green-700 transition"
              >
                Finance Report
              </Link>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
            <h2 className="text-xl font-bold text-gray-900">
              🏠 Inventory Health
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Track stock availability
            </p>

            <div className="mt-5 space-y-2">
              <p className="text-gray-700 font-semibold">
                Total Units:{" "}
                <span className="text-indigo-700 font-bold">
                  {data.totalUnits}
                </span>
              </p>
              <p className="text-gray-700 font-semibold">
                Sold Units:{" "}
                <span className="text-red-600 font-bold">{data.soldUnits}</span>
              </p>
              <p className="text-gray-700 font-semibold">
                Available Units:{" "}
                <span className="text-green-700 font-bold">
                  {data.totalUnits - data.soldUnits}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
            <h2 className="text-xl font-bold text-gray-900">
              💰 Finance Snapshot
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Track collection & due
            </p>

            <div className="mt-5 space-y-2">
              <p className="text-gray-700 font-semibold">
                Total Sales:{" "}
                <span className="text-indigo-700 font-bold">
                  ₹{data.totalSales.toLocaleString()}
                </span>
              </p>
              <p className="text-gray-700 font-semibold">
                Received:{" "}
                <span className="text-green-700 font-bold">
                  ₹{data.totalReceived.toLocaleString()}
                </span>
              </p>
              <p className="text-gray-700 font-semibold">
                Due:{" "}
                <span className="text-red-600 font-bold">
                  ₹{data.due.toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* FOLLOW-UP ALERTS */}
        {alerts && (
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Today's Follow-ups */}
            <div className="bg-yellow-50 p-6 rounded-2xl shadow-lg border border-yellow-200 hover:shadow-xl transition">
              <h2 className="text-xl font-bold text-yellow-800">
                ⏰ Today's Follow-ups: {alerts.todayCount}
              </h2>

              {alerts.todayFollowups.length === 0 ? (
                <p className="text-gray-600 mt-2">
                  No follow-ups scheduled today.
                </p>
              ) : (
                <div className="mt-4 space-y-2">
                  {alerts.todayFollowups.slice(0, 5).map((lead) => (
                    <div
                      key={lead._id}
                      onClick={() => navigate(`/leads/${lead._id}`)}
                      className="bg-white/80 backdrop-blur-md p-3 rounded-xl border border-gray-200 flex justify-between items-center hover:bg-yellow-100 transition cursor-pointer"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {lead.name}
                        </p>
                        <p className="text-sm text-gray-500">{lead.phone}</p>
                      </div>
                      <span className="text-xs font-bold bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full">
                        {lead.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Overdue Follow-ups */}
            <div className="bg-red-50 p-6 rounded-2xl shadow-lg border border-red-200 hover:shadow-xl transition">
              <h2 className="text-xl font-bold text-red-800">
                ⚠️ Overdue Follow-ups: {alerts.overdueCount}
              </h2>

              {alerts.overdueFollowups.length === 0 ? (
                <p className="text-gray-600 mt-2">No overdue follow-ups 🎉</p>
              ) : (
                <div className="mt-4 space-y-2">
                  {alerts.overdueFollowups.slice(0, 5).map((lead) => (
                    <div
                      key={lead._id}
                      onClick={() => navigate(`/leads/${lead._id}`)}
                      className="bg-white/80 backdrop-blur-md p-3 rounded-xl border border-gray-200 flex justify-between items-center hover:bg-red-100 transition cursor-pointer"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {lead.name}
                        </p>
                        <p className="text-sm text-gray-500">{lead.phone}</p>
                      </div>
                      <span className="text-xs font-bold bg-red-200 text-red-800 px-3 py-1 rounded-full">
                        OVERDUE
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CHARTS SECTION */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Lead Funnel Chart */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Lead Pipeline Chart
            </h2>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Finance Pie Chart */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Finance Overview
            </h2>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={financeChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {financeChartData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RECENT LEADS + BOOKINGS */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Leads */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Recent Leads
            </h2>

            {data.recentLeads.length === 0 ? (
              <p className="text-gray-500">No leads found.</p>
            ) : (
              <div className="space-y-3">
                {data.recentLeads.map((lead) => (
                  <div
                    key={lead._id}
                    className="p-3 border border-gray-200 rounded-xl flex justify-between items-center bg-white/70 hover:bg-indigo-50 transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.phone}</p>
                    </div>

                    <span className="text-xs font-bold bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full">
                      {lead.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Bookings */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Recent Bookings
            </h2>

            {data.recentBookings.length === 0 ? (
              <p className="text-gray-500">No bookings found.</p>
            ) : (
              <div className="space-y-3">
                {data.recentBookings.map((b) => (
                  <div
                    key={b._id}
                    className="p-3 border border-gray-200 rounded-xl flex justify-between items-center bg-white/70 hover:bg-green-50 transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {b.leadId?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Unit: {b.unitId?.unitNumber} ({b.unitId?.type})
                      </p>
                    </div>

                    <span className="font-bold text-green-700">
                      ₹{b.sellingPrice.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
