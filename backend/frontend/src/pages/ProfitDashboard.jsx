import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axiosInstance from "../utils/axiosInstance";

export default function ProfitDashboard() {
  const [data, setData] = useState([]);

  const fetchProfitSummary = async () => {
    try {
      const res = await axiosInstance.get("/dashboard/profit-summary");
      setData(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load profit summary ❌");
    }
  };

  useEffect(() => {
    fetchProfitSummary();
  }, []);

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Profit Dashboard</h1>

        {data.length === 0 ? (
          <p className="text-gray-500">No projects found.</p>
        ) : (
          <div className="grid gap-6">
            {data.map((p) => (
              <div key={p.projectId} className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-2xl font-bold mb-2">
                  {p.projectName} ({p.location})
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-gray-600 text-sm">Total Sales</p>
                    <p className="font-bold text-lg">
                      ₹{p.totalSales.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-4 bg-green-100 rounded-lg">
                    <p className="text-gray-600 text-sm">Total Received</p>
                    <p className="font-bold text-lg text-green-700">
                      ₹{p.totalReceived.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-4 bg-red-100 rounded-lg">
                    <p className="text-gray-600 text-sm">Total Expense</p>
                    <p className="font-bold text-lg text-red-700">
                      ₹{p.totalExpense.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-100 rounded-lg">
                    <p className="text-gray-600 text-sm">Due Amount</p>
                    <p className="font-bold text-lg text-yellow-700">
                      ₹{p.due.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-4 bg-blue-100 rounded-lg">
                    <p className="text-gray-600 text-sm">Profit</p>
                    <p className="font-bold text-lg text-blue-700">
                      ₹{p.profit.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
