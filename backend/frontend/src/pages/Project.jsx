import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axiosInstance from "../utils/axiosInstance";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [totalUnits, setTotalUnits] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get("/projects");
      setProjects(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load projects");
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/projects/create", {
        name,
        location,
        totalUnits: Number(totalUnits),
      });

      alert("Project Created ✅");

      setName("");
      setLocation("");
      setTotalUnits("");

      fetchProjects();
    } catch (error) {
      console.log(error);
      alert("Project creation failed ❌");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Layout>
      <div>
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Projects 🏗️
            </h1>
            <p className="text-gray-600 mt-1">
              Manage all your real estate projects here
            </p>
          </div>
        </div>

        {/* Create Project Form */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 mb-10 hover:shadow-xl transition">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            ➕ Create New Project
          </h2>

          <form onSubmit={handleCreateProject} className="grid gap-4">
            <input
              type="text"
              placeholder="Project Name"
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Location"
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Total Units"
              className="p-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={totalUnits}
              onChange={(e) => setTotalUnits(e.target.value)}
            />

            <button className="bg-indigo-600 text-white p-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow">
              Create Project
            </button>
          </form>
        </div>

        {/* Project List */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">📋 All Projects</h2>
            <span className="text-sm font-semibold text-gray-600">
              Total: {projects.length}
            </span>
          </div>

          {projects.length === 0 ? (
            <p className="text-gray-500">No projects found.</p>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="p-5 border border-gray-200 rounded-2xl flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white/70 hover:bg-indigo-50 transition"
                >
                  <div>
                    <h3 className="font-extrabold text-xl text-gray-900">
                      {project.name}
                    </h3>

                    <p className="text-gray-600 mt-1">
                      📍 Location:{" "}
                      <span className="font-semibold">{project.location}</span>
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      🏠 Total Units:{" "}
                      <span className="font-bold text-indigo-700">
                        {project.totalUnits}
                      </span>
                    </p>
                  </div>

                  <div className="text-sm text-gray-500 font-semibold">
                    📅 {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

