import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axiosInstance from "../utils/axiosInstance";

export default function Payments() {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);

  const [selectedBooking, setSelectedBooking] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [remarks, setRemarks] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");

  // Loading
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("/api/bookings");
      setBookings(res.data);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to load bookings ❌");
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await axiosInstance.get("/api/payments");
      setPayments(res.data);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to load payments ❌");
    }
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();

    if (!selectedBooking) {
      alert("Please select a booking ❌");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Enter valid payment amount ❌");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post("/payments/create", {
        bookingId: selectedBooking,
        amount: Number(amount),
        method,
        remarks,
      });

      alert("Payment Added ✅");

      setSelectedBooking("");
      setAmount("");
      setMethod("Cash");
      setRemarks("");

      fetchPayments();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Payment failed ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchPayments();
  }, []);

  // Filter payments
  const filteredPayments = payments
    .filter((p) => {
      const leadName = p.bookingId?.leadId?.name || "";
      const unitNumber = p.bookingId?.unitId?.unitNumber || "";
      const remarksText = p.remarks || "";

      const matchSearch =
        leadName.toLowerCase().includes(search.toLowerCase()) ||
        unitNumber.toLowerCase().includes(search.toLowerCase()) ||
        remarksText.toLowerCase().includes(search.toLowerCase());

      const matchMethod =
        methodFilter === "All" ? true : p.method === methodFilter;

      return matchSearch && matchMethod;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // latest first

  const getMethodBadge = (method) => {
    if (method === "Cash")
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (method === "UPI")
      return "bg-green-100 text-green-700 border-green-200";
    if (method === "Bank Transfer")
      return "bg-blue-100 text-blue-700 border-blue-200";
    if (method === "Cheque")
      return "bg-purple-100 text-purple-700 border-purple-200";

    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  return (
    <Layout>
      <div>
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Payments 💳
          </h1>
          <p className="text-gray-600 mt-1">
            Add and manage all payments received from customers
          </p>
        </div>

        {/* Add Payment Form */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 mb-10 hover:shadow-xl transition">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            ➕ Add Payment
          </h2>

          <form
            onSubmit={handleCreatePayment}
            className="grid md:grid-cols-2 gap-4"
          >
            <select
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none md:col-span-2"
              value={selectedBooking}
              onChange={(e) => setSelectedBooking(e.target.value)}
              required
            >
              <option value="">-- Select Booking --</option>
              {bookings.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.leadId?.name} | Unit: {b.unitId?.unitNumber} | ₹
                  {b.sellingPrice?.toLocaleString()}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Amount"
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <select
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>

            <input
              type="text"
              placeholder="Remarks (optional)"
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none md:col-span-2"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <button
              disabled={loading}
              className={`md:col-span-2 p-3 rounded-xl font-semibold transition shadow ${loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
            >
              {loading ? "Adding..." : "Add Payment"}
            </button>
          </form>
        </div>

        {/* Payments List */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
            <h2 className="text-xl font-bold text-gray-900">📋 All Payments</h2>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search lead / unit / remarks..."
                className="p-2 px-4 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="p-2 px-4 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
              >
                <option value="All">All Methods</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          {filteredPayments.length === 0 ? (
            <p className="text-gray-500">No payments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-indigo-100 text-left text-gray-800">
                    <th className="p-3 border">Booking</th>
                    <th className="p-3 border">Amount</th>
                    <th className="p-3 border">Method</th>
                    <th className="p-3 border">Remarks</th>
                    <th className="p-3 border">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.map((p) => (
                    <tr key={p._id} className="hover:bg-indigo-50 transition">
                      <td className="p-3 border font-semibold text-gray-900">
                        {p.bookingId?.leadId?.name}{" "}
                        <span className="text-gray-500 font-normal">
                          | Unit {p.bookingId?.unitId?.unitNumber}
                        </span>
                      </td>

                      <td className="p-3 border font-extrabold text-green-700">
                        ₹{p.amount.toLocaleString()}
                      </td>

                      <td className="p-3 border">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${getMethodBadge(
                            p.method
                          )}`}
                        >
                          {p.method}
                        </span>
                      </td>

                      <td className="p-3 border text-gray-700">
                        {p.remarks || "-"}
                      </td>

                      <td className="p-3 border text-gray-500">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="text-sm text-gray-500 mt-4">
                Showing{" "}
                <span className="font-bold">{filteredPayments.length}</span>{" "}
                payments
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}


