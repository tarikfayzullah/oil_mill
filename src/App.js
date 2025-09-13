import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import RawMaterial from "./pages/RawMaterial";
import OilProduction from "./pages/OilProduction";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/raw-material" 
        element={
          <ProtectedRoute>
            <RawMaterial />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/oil-production" 
        element={
          <ProtectedRoute>
            <OilProduction />
          </ProtectedRoute>
        } 
      />

      {/* Redirect unknown routes to login */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}
