import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import axiosInstance from "../utils/axiosInstance";

export default function Expenses() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const [expenses, setExpenses] = useState([]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get("/api/projects");
      setProjects(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load projects ❌");
    }
  };

  const fetchExpenses = async (projectId) => {
    try {
      const res = await axiosInstance.get(`/api/expenses/${projectId}`);
      setExpenses(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load expenses ❌");
    }
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();

    if (!selectedProject) {
      alert("Please select a project first");
      return;
    }

    try {
      await axiosInstance.post("/expenses/create", {
        projectId: selectedProject,
        title,
        category,
        amount: Number(amount),
        remarks,
      });

      alert("Expense Added ✅");

      setTitle("");
      setCategory("");
      setAmount("");
      setRemarks("");

      fetchExpenses(selectedProject);
    } catch (error) {
      console.log(error);
      alert("Expense creation failed ❌");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchExpenses(selectedProject);
    }
  }, [selectedProject]);

  const totalInvestment = expenses.reduce((sum, e) => sum + e.amount, 0);

  const highestExpense = expenses.reduce((max, e) => {
    return e.amount > max ? e.amount : max;
  }, 0);

  const uniqueCategories = useMemo(() => {
    const cats = expenses
      .map((e) => e.category)
      .filter((c) => c && c.trim() !== "");
    return [...new Set(cats)];
  }, [expenses]);

  const filteredExpenses = expenses.filter((ex) => {
    const matchSearch =
      ex.title.toLowerCase().includes(search.toLowerCase()) ||
      (ex.category || "").toLowerCase().includes(search.toLowerCase()) ||
      (ex.remarks || "").toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      categoryFilter === "All" ? true : ex.category === categoryFilter;

    return matchSearch && matchCategory;
  });

  const getCategoryBadge = (cat) => {
    if (!cat) return "bg-gray-100 text-gray-700 border-gray-200";

    const lower = cat.toLowerCase();

    if (lower.includes("material"))
      return "bg-blue-100 text-blue-700 border-blue-200";
    if (lower.includes("labour"))
      return "bg-green-100 text-green-700 border-green-200";
    if (lower.includes("legal"))
      return "bg-purple-100 text-purple-700 border-purple-200";
    if (lower.includes("marketing"))
      return "bg-pink-100 text-pink-700 border-pink-200";

    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  return (
    <Layout>
      <div>
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Expenses / Investment 💸
          </h1>
          <p className="text-gray-600 mt-1">
            Track your project spending and total investment
          </p>
        </div>

        {/* Project Selector */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 mb-8 hover:shadow-xl transition">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🏗️ Select Project
          </h2>

          <select
            className="p-3 border rounded-xl w-full bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
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

        {/* SUMMARY CARDS */}
        {selectedProject && (
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl shadow-lg hover:scale-[1.01] transition">
              <p className="text-sm opacity-90">Total Investment</p>
              <p className="text-3xl font-extrabold mt-2">
                ₹{totalInvestment.toLocaleString()}
              </p>
              <p className="text-xs opacity-90 mt-2">
                Total amount spent on this project
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-rose-500 text-white p-6 rounded-2xl shadow-lg hover:scale-[1.01] transition">
              <p className="text-sm opacity-90">Highest Expense</p>
              <p className="text-3xl font-extrabold mt-2">
                ₹{highestExpense.toLocaleString()}
              </p>
              <p className="text-xs opacity-90 mt-2">
                Largest single expense entry
              </p>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-6 rounded-2xl shadow-lg hover:scale-[1.01] transition">
              <p className="text-sm opacity-90">Total Records</p>
              <p className="text-3xl font-extrabold mt-2">{expenses.length}</p>
              <p className="text-xs opacity-90 mt-2">
                Expense entries saved
              </p>
            </div>
          </div>
        )}

        {/* Add Expense Form */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 mb-10 hover:shadow-xl transition">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            ➕ Add Expense
          </h2>

          <form
            onSubmit={handleCreateExpense}
            className="grid md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Expense Title (Cement Purchase, Labour Payment)"
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none md:col-span-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Category (Material / Labour / Legal / Marketing)"
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <input
              type="number"
              placeholder="Amount"
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Remarks (optional)"
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none md:col-span-2"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <button className="md:col-span-2 bg-indigo-600 text-white p-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow">
              Add Expense
            </button>
          </form>
        </div>

        {/* Expense List */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              📋 Expense Records
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search title / category / remarks..."
                className="p-2 px-4 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="p-2 px-4 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                {uniqueCategories.map((c, idx) => (
                  <option key={idx} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!selectedProject ? (
            <p className="text-gray-500">Select a project to view expenses.</p>
          ) : filteredExpenses.length === 0 ? (
            <p className="text-gray-500">No expenses found for this project.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-indigo-100 text-left text-gray-800">
                    <th className="p-3 border">Title</th>
                    <th className="p-3 border">Category</th>
                    <th className="p-3 border">Amount</th>
                    <th className="p-3 border">Remarks</th>
                    <th className="p-3 border">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredExpenses.map((ex) => (
                    <tr key={ex._id} className="hover:bg-indigo-50 transition">
                      <td className="p-3 border font-semibold text-gray-900">
                        {ex.title}
                      </td>

                      <td className="p-3 border">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryBadge(
                            ex.category
                          )}`}
                        >
                          {ex.category || "Other"}
                        </span>
                      </td>

                      <td className="p-3 border font-extrabold text-red-600">
                        ₹{ex.amount.toLocaleString()}
                      </td>

                      <td className="p-3 border text-gray-700">
                        {ex.remarks || "-"}
                      </td>

                      <td className="p-3 border text-gray-500">
                        {new Date(ex.expenseDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="text-sm text-gray-500 mt-4">
                Showing{" "}
                <span className="font-bold">{filteredExpenses.length}</span>{" "}
                records
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
