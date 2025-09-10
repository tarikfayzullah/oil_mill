import { useState } from "react";
import RawMaterial from "./pages/RawMaterial";
import OilProduction from "./pages/OilProduction";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [view, setView] = useState("dashboard");

  return (
    <div>
      {view === "dashboard" && <Dashboard setView={setView} />}
      {view === "rawMaterial" && <RawMaterial setView={setView} />}
      {view === "oilProduction" && <OilProduction setView={setView} />}
    </div>
  );
}
