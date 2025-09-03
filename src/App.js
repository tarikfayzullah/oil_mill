import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import RawMaterial from "./pages/RawMaterial";
import OilProduction from "./pages/OilProduction";

export default function App() {
  const [view, setView] = useState("dashboard"); // "dashboard", "rawMaterial", "oilProduction"
  const [editProductionIndex, setEditProductionIndex] = useState(null);

  return (
    <>
      {view === "dashboard" && <Dashboard setView={setView} setEditProductionIndex={setEditProductionIndex} />}
      {view === "rawMaterial" && <RawMaterial setView={setView} />}
      {view === "oilProduction" && <OilProduction setView={setView} editIndex={editProductionIndex} setEditIndex={setEditProductionIndex} />}
    </>
  );
}
