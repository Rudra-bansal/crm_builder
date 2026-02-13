import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [companyLocation, setCompanyLocation] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const res = await axiosInstance.post("/api/auth/register", {

                name,
                email,
                password,
                companyName,
                companyLocation,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.user.role);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            alert("Company Registered Successfully ✅");
            navigate("/dashboard");
        } catch (error) {
            console.log(error.response?.data);
            alert(error.response?.data?.message || "Registration Failed ❌");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-800">
            <div className="bg-white/95 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-[450px] border border-gray-200">
                <h1 className="text-3xl font-extrabold mb-2 text-center text-gray-900">
                    Builder CRM
                </h1>
                <p className="text-center text-gray-500 mb-6">
                    Register your company & admin account
                </p>

                <form onSubmit={handleRegister} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Admin Name"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Company Name"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Company Location"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={companyLocation}
                        onChange={(e) => setCompanyLocation(e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
                    >
                        Register
                    </button>
                </form>

                <p className="text-sm text-gray-600 text-center mt-6">
                    Already have an account?{" "}
                    <Link to="/" className="text-indigo-700 font-bold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
