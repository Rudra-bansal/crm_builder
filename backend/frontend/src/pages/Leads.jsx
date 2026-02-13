import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Link, useLocation } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import axiosInstance from "../utils/axiosInstance";

export default function Leads() {
  const location = useLocation();

  const [leads, setLeads] = useState([]);

  // Create Lead Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("New");

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Loading State
  const [loading, setLoading] = useState(false);

  // Fetch Leads
  const fetchLeads = async () => {
    try {
      const res = await axiosInstance.get("/api/leads");
      setLeads(res.data);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to load leads ❌");
    }
  };

  // Status Update
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await axiosInstance.put(`/leads/update-status/${leadId}`, {
        status: newStatus,
      });

      fetchLeads();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to update status ❌");
    }
  };

  // Follow-up Update
  const handleFollowUpUpdate = async (leadId, followUpDate) => {
    try {
      await axiosInstance.put(`/leads/update-followup/${leadId}`, {
        followUpDate,
      });

      fetchLeads();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to update follow-up ❌");
    }
  };

  // Create Lead
  const handleCreateLead = async (e) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      alert("Name and Phone are required ❌");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post("/leads/create", {
        name: name.trim(),
        phone: phone.trim(),
        budget,
        source,
        status,
      });

      alert("Lead Created ✅");

      setName("");
      setPhone("");
      setBudget("");
      setSource("");
      setStatus("New");

      fetchLeads();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Lead creation failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // Load leads initially
  useEffect(() => {
    fetchLeads();
  }, []);

  // ✅ Auto search from URL (Layout search bar)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search");

    if (query) {
      setSearch(query);
    }
  }, [location.search]);

  // Filter leads based on search + status
  const filteredLeads = leads.filter((lead) => {
    const matchSearch =
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone?.toLowerCase().includes(search.toLowerCase()) ||
      lead.source?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "All" ? true : lead.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <Layout>
      <div>
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Leads 📞</h1>
          <p className="text-gray-600 mt-1">
            Manage customer inquiries and follow-ups efficiently
          </p>
        </div>

        {/* Create Lead Form */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 mb-10 hover:shadow-xl transition">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            ➕ Add New Lead
          </h2>

          <form
            onSubmit={handleCreateLead}
            className="grid md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Customer Name"
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Phone Number"
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Budget (optional)"
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />

            <input
              type="text"
              placeholder="Lead Source (Facebook, Broker, Walk-in)"
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />

            <select
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="New">New</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Site Visit">Site Visit</option>
              <option value="Booked">Booked</option>
              <option value="Lost">Lost</option>
            </select>

            <button
              disabled={loading}
              className={`p-3 rounded-xl font-semibold transition shadow ${loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
            >
              {loading ? "Adding..." : "Add Lead"}
            </button>
          </form>
        </div>

        {/* Leads List */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
            <h2 className="text-xl font-bold text-gray-900">📋 All Leads</h2>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search name / phone / source..."
                className="p-2 px-4 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="p-2 px-4 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Site Visit">Site Visit</option>
                <option value="Booked">Booked</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          </div>

          {filteredLeads.length === 0 ? (
            <p className="text-gray-500">No leads found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-indigo-100 text-left text-gray-800">
                    <th className="p-3 border">Name</th>
                    <th className="p-3 border">Phone</th>
                    <th className="p-3 border">Budget</th>
                    <th className="p-3 border">Source</th>
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border">Follow-up</th>
                    <th className="p-3 border">Notes</th>
                    <th className="p-3 border">Created</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-indigo-50 transition">
                      {/* Name clickable */}
                      <td className="p-3 border text-indigo-700 font-extrabold hover:underline cursor-pointer">
                        <Link to={`/leads/${lead._id}`}>{lead.name}</Link>
                      </td>

                      <td className="p-3 border font-semibold">{lead.phone}</td>
                      <td className="p-3 border">{lead.budget || "-"}</td>
                      <td className="p-3 border">{lead.source || "-"}</td>

                      {/* Status Badge + Dropdown */}
                      <td className="p-3 border">
                        <div className="flex items-center gap-3">
                          <StatusBadge status={lead.status} />

                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleStatusChange(lead._id, e.target.value)
                            }
                            className="p-2 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
                          >
                            <option value="New">New</option>
                            <option value="Follow-up">Follow-up</option>
                            <option value="Site Visit">Site Visit</option>
                            <option value="Booked">Booked</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </div>
                      </td>

                      {/* Follow-up Date */}
                      <td className="p-3 border">
                        <input
                          type="date"
                          className="p-2 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
                          value={
                            lead.followUpDate
                              ? lead.followUpDate.split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            handleFollowUpUpdate(lead._id, e.target.value)
                          }
                        />
                      </td>

                      {/* Notes Count */}
                      <td className="p-3 border text-gray-600 font-semibold">
                        {lead.notes?.length > 0
                          ? `${lead.notes.length} Notes`
                          : "No Notes"}
                      </td>

                      {/* Created Date */}
                      <td className="p-3 border text-gray-500">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Footer Count */}
              <p className="text-sm text-gray-500 mt-4">
                Showing{" "}
                <span className="font-bold">{filteredLeads.length}</span> leads
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
