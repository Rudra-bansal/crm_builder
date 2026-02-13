import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Project";
import ProtectedRoute from "./components/ProtectedRoute";
import Leads from "./pages/Leads";
import Inventory from "./pages/Inventory";
import Bookings from "./pages/Bookings";
import Payments from "./pages/Payments";
import Finance from "./pages/Finance";
import Expenses from "./pages/Expenses";
import ProfitDashboard from "./pages/ProfitDashboard";
import LeadDetails from "./pages/LeadDetails";
import Register from "./pages/Register";







function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<Register />} />


        <Route path="/projects" element={<ProtectedRoute> <Projects /> </ProtectedRoute>} />
        <Route path="/leads" element={<ProtectedRoute> <Leads /> </ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute> <Inventory /> </ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute> <Bookings /> </ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute> <Payments /> </ProtectedRoute>} />
        <Route path="/finance" element={<ProtectedRoute> <Finance /> </ProtectedRoute>} />
        <Route path="/expenses" element={<ProtectedRoute> <Expenses /> </ProtectedRoute>} />
        <Route path="/profit" element={<ProtectedRoute> <ProfitDashboard /> </ProtectedRoute>} />
        <Route path="/leads/:id" element={<ProtectedRoute> <LeadDetails /> </ProtectedRoute>} />





      </Routes>
    </Router>
  );
}

export default App;

