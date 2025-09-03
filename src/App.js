import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RawMaterial from "./pages/RawMaterial";
import OilProduction from "./pages/OilProduction";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState("dashboard");

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  return (
    <>
      {view === "dashboard" && <Dashboard setView={setView} />}
      {view === "rawMaterial" && <RawMaterial setView={setView} />}
      {view === "oilProduction" && <OilProduction setView={setView} />}
    </>
  );
}

export default App;
