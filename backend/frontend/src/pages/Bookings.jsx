import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axiosInstance from "../utils/axiosInstance";

export default function Bookings() {
  const [leads, setLeads] = useState([]);
  const [projects, setProjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [selectedLead, setSelectedLead] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");

  const [sellingPrice, setSellingPrice] = useState("");
  const [bookingAmount, setBookingAmount] = useState("");

  // Filters
  const [search, setSearch] = useState("");

  const fetchLeads = async () => {
    try {
      const res = await axiosInstance.get("/leads");
      setLeads(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load leads ❌");
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get("/projects");
      setProjects(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load projects ❌");
    }
  };

  const fetchUnits = async (projectId) => {
    try {
      const res = await axiosInstance.get(`/units/${projectId}`);
      setUnits(res.data.filter((u) => u.status === "Available"));
    } catch (error) {
      console.log(error);
      alert("Failed to load units ❌");
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("/bookings");
      setBookings(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load bookings ❌");
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();

    if (!selectedLead || !selectedUnit) {
      alert("Please select Lead and Unit");
      return;
    }

    try {
      await axiosInstance.post("/bookings/create", {
        leadId: selectedLead,
        unitId: selectedUnit,
        sellingPrice: Number(sellingPrice),
        bookingAmount: Number(bookingAmount),
      });

      alert("Booking Created ✅");

      setSelectedLead("");
      setSelectedProject("");
      setSelectedUnit("");
      setSellingPrice("");
      setBookingAmount("");

      fetchBookings();
    } catch (error) {
      console.log(error);
      alert("Booking failed ❌");
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchProjects();
    fetchBookings();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchUnits(selectedProject);
    } else {
      setUnits([]);
    }
  }, [selectedProject]);

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const leadName = b.leadId?.name || "";
    const leadPhone = b.leadId?.phone || "";
    const unitNumber = b.unitId?.unitNumber || "";
    const unitType = b.unitId?.type || "";

    return (
      leadName.toLowerCase().includes(search.toLowerCase()) ||
      leadPhone.toLowerCase().includes(search.toLowerCase()) ||
      unitNumber.toLowerCase().includes(search.toLowerCase()) ||
      unitType.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Layout>
      <div>
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Bookings 💰
          </h1>
          <p className="text-gray-600 mt-1">
            Manage bookings and track unit sales history
          </p>
        </div>

        {/* Create Booking Form */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 mb-10 hover:shadow-xl transition">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            ➕ Create Booking
          </h2>

          <form
            onSubmit={handleCreateBooking}
            className="grid md:grid-cols-2 gap-4"
          >
            {/* Lead Dropdown */}
            <select
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={selectedLead}
              onChange={(e) => setSelectedLead(e.target.value)}
              required
            >
              <option value="">-- Select Lead --</option>
              {leads.map((lead) => (
                <option key={lead._id} value={lead._id}>
                  {lead.name} ({lead.phone})
                </option>
              ))}
            </select>

            {/* Project Dropdown */}
            <select
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              required
            >
              <option value="">-- Select Project --</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.location})
                </option>
              ))}
            </select>

            {/* Unit Dropdown */}
            <select
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              required
            >
              <option value="">-- Select Available Unit --</option>
              {units.map((unit) => (
                <option key={unit._id} value={unit._id}>
                  {unit.unitNumber} - {unit.type} - ₹
                  {unit.basePrice?.toLocaleString()}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Selling Price"
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Booking Amount (optional)"
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={bookingAmount}
              onChange={(e) => setBookingAmount(e.target.value)}
            />

            <button className="md:col-span-2 bg-green-600 text-white p-3 rounded-xl font-semibold hover:bg-green-700 transition shadow">
              Create Booking
            </button>
          </form>
        </div>

        {/* Booking List */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
            <h2 className="text-xl font-bold text-gray-900">📋 All Bookings</h2>

            <input
              type="text"
              placeholder="Search lead / phone / unit..."
              className="p-2 px-4 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredBookings.length === 0 ? (
            <p className="text-gray-500">No bookings found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-green-100 text-left text-gray-800">
                    <th className="p-3 border">Lead</th>
                    <th className="p-3 border">Unit</th>
                    <th className="p-3 border">Selling Price</th>
                    <th className="p-3 border">Booking Amount</th>
                    <th className="p-3 border">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-green-50 transition">
                      <td className="p-3 border font-semibold text-gray-900">
                        {b.leadId?.name}{" "}
                        <span className="text-gray-500 font-normal">
                          ({b.leadId?.phone})
                        </span>
                      </td>

                      <td className="p-3 border font-semibold text-indigo-700">
                        {b.unitId?.unitNumber}{" "}
                        <span className="text-gray-500 font-normal">
                          ({b.unitId?.type})
                        </span>
                      </td>

                      <td className="p-3 border font-extrabold text-green-700">
                        ₹{b.sellingPrice.toLocaleString()}
                      </td>

                      <td className="p-3 border font-semibold text-gray-800">
                        ₹{b.bookingAmount?.toLocaleString() || "0"}
                      </td>

                      <td className="p-3 border text-gray-500">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="text-sm text-gray-500 mt-4">
                Showing{" "}
                <span className="font-bold">{filteredBookings.length}</span>{" "}
                bookings
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

