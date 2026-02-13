import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axiosInstance from "../utils/axiosInstance";

export default function Finance() {
  const [summary, setSummary] = useState([]);

  const fetchSummary = async () => {
    try {
      const res = await axiosInstance.get("/bookings/summary/all");
      setSummary(res.data);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to load finance summary");
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);
  const totalSales = summary.reduce((sum, s) => sum + s.sellingPrice, 0);
  const totalReceived = summary.reduce((sum, s) => sum + s.receivedAmount, 0);
  const totalDue = summary.reduce((sum, s) => sum + s.dueAmount, 0);

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Finance Summary</h1>

        {summary.length === 0 ? (
          <p className="text-gray-500">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto bg-white p-6 rounded-xl shadow">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-indigo-100 rounded-xl">
                <p className="text-gray-600 text-sm">Total Sales</p>
                <p className="font-bold text-xl text-indigo-700">
                  ₹{totalSales.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-green-100 rounded-xl">
                <p className="text-gray-600 text-sm">Total Received</p>
                <p className="font-bold text-xl text-green-700">
                  ₹{totalReceived.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-red-100 rounded-xl">
                <p className="text-gray-600 text-sm">Total Due</p>
                <p className="font-bold text-xl text-red-700">
                  ₹{totalDue.toLocaleString()}
                </p>
              </div>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-3 border">Lead</th>
                  <th className="p-3 border">Phone</th>
                  <th className="p-3 border">Unit</th>
                  <th className="p-3 border">Selling Price</th>
                  <th className="p-3 border">Received</th>
                  <th className="p-3 border">Due</th>
                </tr>
              </thead>

              <tbody>
                {summary.map((s) => (
                  <tr key={s.bookingId} className="hover:bg-gray-50">
                    <td className="p-3 border font-semibold">{s.leadName}</td>
                    <td className="p-3 border">{s.phone}</td>
                    <td className="p-3 border">
                      {s.unitNumber} ({s.unitType})
                    </td>
                    <td className="p-3 border font-semibold">
                      ₹{s.sellingPrice.toLocaleString()}
                    </td>
                    <td className="p-3 border text-green-700 font-semibold">
                      ₹{s.receivedAmount.toLocaleString()}
                    </td>
                    <td className="p-3 border text-red-600 font-semibold">
                      ₹{s.dueAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
