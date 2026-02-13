export default function StatusBadge({ status }) {
  const colors = {
    New: "bg-gray-200 text-gray-800",
    "Follow-up": "bg-blue-200 text-blue-800",
    "Site Visit": "bg-yellow-200 text-yellow-800",
    Booked: "bg-green-200 text-green-800",
    Lost: "bg-red-200 text-red-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold ${
        colors[status] || "bg-gray-200 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}
