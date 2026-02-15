import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import axiosInstance from "../utils/axiosInstance";

export default function LeadDetails() {
  const { id } = useParams();

  const [lead, setLead] = useState(null);
  const [note, setNote] = useState("");

  const fetchLead = async () => {
    try {
      const res = await axiosInstance.get(`/api/leads/${id}`);
      setLead(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load lead details");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axiosInstance.put(`/api/leads/update-status/${id}`, {
        status: newStatus,
      });
      fetchLead();
    } catch (error) {
      console.log(error);
      alert("Failed to update status");
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;

    try {
      await axiosInstance.post(`/api/leads/add-note/${id}`, {
        note,
      });

      setNote("");
      fetchLead();
    } catch (error) {
      console.log(error);
      alert("Failed to add note");
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  if (!lead) {
    return (
      <Layout>
        <p className="text-gray-500">Loading lead details...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Lead Profile</h1>

        {/* Lead Info Card */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-2xl font-bold">{lead.name}</h2>
          <p className="text-gray-500 mt-1">📞 {lead.phone}</p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <p>
              <span className="font-semibold">Budget:</span>{" "}
              {lead.budget || "-"}
            </p>

            <p>
              <span className="font-semibold">Source:</span>{" "}
              {lead.source || "-"}
            </p>

            <p>
              <span className="font-semibold">Follow-up Date:</span>{" "}
              {lead.followUpDate
                ? new Date(lead.followUpDate).toLocaleDateString()
                : "-"}
            </p>

            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span className="text-blue-600 font-bold">{lead.status}</span>
            </p>
          </div>

          {/* Status Dropdown */}
          <div className="mt-5">
            <label className="font-semibold block mb-2">Update Status</label>
            <select
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="p-3 border rounded-lg w-full"
            >
              <option value="New">New</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Site Visit">Site Visit</option>
              <option value="Booked">Booked</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Notes History</h2>

          {lead.notes?.length > 0 ? (
            <div className="space-y-3">
              {[...lead.notes].reverse().map((n, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <p>{n.note}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {n.date ? new Date(n.date).toLocaleString() : "No date"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No notes available.</p>
          )}
        </div>

        {/* Add Note */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Add Note</h2>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write follow-up note..."
            className="w-full p-3 border rounded-lg mb-4"
            rows="4"
          />

          <button
            onClick={handleAddNote}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Add Note
          </button>
        </div>
      </div>
    </Layout>
  );
}
