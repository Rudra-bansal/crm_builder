import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axiosInstance from "../utils/axiosInstance";

export default function Inventory() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const [units, setUnits] = useState([]);

  const [tower, setTower] = useState("");
  const [floor, setFloor] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [type, setType] = useState("");
  const [area, setArea] = useState("");
  const [basePrice, setBasePrice] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Loading
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get("/api/projects");
      setProjects(res.data);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to load projects ❌");
    }
  };

  const fetchUnits = async (projectId) => {
    try {
      const res = await axiosInstance.get(`/api/units/${projectId}`);
      setUnits(res.data);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to load units ❌");
    }
  };

  const handleCreateUnit = async (e) => {
    e.preventDefault();

    if (!selectedProject) {
      alert("Please select a project first ❌");
      return;
    }

    if (!unitNumber.trim()) {
      alert("Unit Number is required ❌");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post("/units/create", {
        projectId: selectedProject,
        tower,
        floor: floor ? Number(floor) : undefined,
        unitNumber: unitNumber.trim(),
        type,
        area: area ? Number(area) : undefined,
        basePrice: basePrice ? Number(basePrice) : undefined,
      });

      alert("Unit Added ✅");

      setTower("");
      setFloor("");
      setUnitNumber("");
      setType("");
      setArea("");
      setBasePrice("");

      fetchUnits(selectedProject);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to create unit ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (unitId, newStatus) => {
    try {
      await axiosInstance.put(`/units/update-status/${unitId}`, {
        status: newStatus,
      });

      fetchUnits(selectedProject);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to update status ❌");
    }
  };

  const getStatusBadge = (status) => {
    if (status === "Available") {
      return "bg-green-100 text-green-700 border-green-200";
    }
    if (status === "Hold") {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
    if (status === "Sold") {
      return "bg-red-100 text-red-700 border-red-200";
    }
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      setUnits([]); // clear old project units immediately
      fetchUnits(selectedProject);
    }
  }, [selectedProject]);

  // Filtered Units
  const filteredUnits = units
    .filter((unit) => {
      const matchSearch =
        unit.unitNumber?.toLowerCase().includes(search.toLowerCase()) ||
        unit.type?.toLowerCase().includes(search.toLowerCase()) ||
        unit.tower?.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "All" ? true : unit.status === statusFilter;

      return matchSearch && matchStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // latest first

  return (
    <Layout>
      <div>
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Inventory 🏠
          </h1>
          <p className="text-gray-600 mt-1">
            Manage all project units and their availability
          </p>
        </div>

        {/* Project Selector */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 mb-8 hover:shadow-xl transition">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📌 Select Project
          </h2>

          <select
            className="p-3 border border-gray-200 rounded-xl w-full bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">-- Select Project --</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.location})
              </option>
            ))}
          </select>
        </div>

        {/* Create Unit Form */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 mb-8 hover:shadow-xl transition">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            ➕ Add New Unit
          </h2>

          <form
            onSubmit={handleCreateUnit}
            className="grid md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Tower (optional)"
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={tower}
              onChange={(e) => setTower(e.target.value)}
            />

            <input
              type="number"
              placeholder="Floor"
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
            />

            <input
              type="text"
              placeholder="Unit Number (Flat No.)"
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={unitNumber}
              onChange={(e) => setUnitNumber(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Type (2BHK / 3BHK)"
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />

            <input
              type="number"
              placeholder="Area (sqft)"
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />

            <input
              type="number"
              placeholder="Base Price"
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
            />

            <button
              disabled={loading}
              className={`md:col-span-2 p-3 rounded-xl font-semibold transition shadow ${loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
            >
              {loading ? "Adding..." : "Add Unit"}
            </button>
          </form>
        </div>

        {/* Units Table */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
            <h2 className="text-xl font-bold text-gray-900">📋 Units List</h2>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search unit / tower / type..."
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
                <option value="Available">Available</option>
                <option value="Hold">Hold</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
          </div>

          {!selectedProject ? (
            <p className="text-gray-500">Select a project to view units.</p>
          ) : filteredUnits.length === 0 ? (
            <p className="text-gray-500">No units found for this project.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-indigo-100 text-left text-gray-800">
                    <th className="p-3 border">Tower</th>
                    <th className="p-3 border">Floor</th>
                    <th className="p-3 border">Unit No.</th>
                    <th className="p-3 border">Type</th>
                    <th className="p-3 border">Area</th>
                    <th className="p-3 border">Base Price</th>
                    <th className="p-3 border">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUnits.map((unit) => (
                    <tr key={unit._id} className="hover:bg-indigo-50 transition">
                      <td className="p-3 border">{unit.tower || "-"}</td>
                      <td className="p-3 border">{unit.floor || "-"}</td>

                      <td className="p-3 border font-extrabold text-indigo-700">
                        {unit.unitNumber}
                      </td>

                      <td className="p-3 border">{unit.type || "-"}</td>
                      <td className="p-3 border">{unit.area || "-"}</td>

                      <td className="p-3 border font-semibold text-gray-800">
                        ₹
                        {unit.basePrice
                          ? unit.basePrice.toLocaleString()
                          : "-"}
                      </td>

                      <td className="p-3 border">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                              unit.status
                            )}`}
                          >
                            {unit.status}
                          </span>

                          <select
                            value={unit.status}
                            onChange={(e) =>
                              handleStatusChange(unit._id, e.target.value)
                            }
                            className="p-2 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
                          >
                            <option value="Available">Available</option>
                            <option value="Hold">Hold</option>
                            <option value="Sold">Sold</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Footer Count */}
              <p className="text-sm text-gray-500 mt-4">
                Showing{" "}
                <span className="font-bold">{filteredUnits.length}</span> units
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

