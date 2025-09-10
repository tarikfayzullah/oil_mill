import { useState, useEffect } from "react";
import axios from "axios";

export default function OilProduction({ setView }) {
  const [productions, setProductions] = useState([]);
  const [rawUsed, setRawUsed] = useState("");
  const [oilProduced, setOilProduced] = useState("");

  const MON_KG = 40; // প্রতি মন কেজিতে
  const LOSS_PER_MANE = 1.5; // প্রতি মন খইল/ঘাটতি

  const fetchProductions = async () => {
    const res = await axios.get("http://localhost:5000/api/oil-production");
    setProductions(res.data.data);
  };

  useEffect(() => {
    fetchProductions();
  }, []);

  const handleSave = async () => {
    if (!rawUsed || !oilProduced) return alert("সব এন্ট্রি দিন!");

    const rawKg = Number(rawUsed);
    const oilKg = Number(oilProduced);

    const expectedLoss = rawKg / MON_KG * LOSS_PER_MANE;
    let mealProduced = rawKg - oilKg - expectedLoss;
    let deficit = 0;
    if (mealProduced < 0) {
      deficit = Math.abs(mealProduced);
      mealProduced = 0;
    }

    const res = await axios.post("http://localhost:5000/api/oil-production", {
      rawUsed: rawKg,
      oilProduced: oilKg,
      mealProduced: mealProduced.toFixed(2),
      loss: expectedLoss.toFixed(2),
      deficit: deficit.toFixed(2),
      date: new Date().toLocaleDateString(),
    });

    setRawUsed("");
    setOilProduced("");
    setProductions([...productions, res.data.data]);
  };

  // টোটাল হিসাব
  const totalRaw = productions.reduce((acc, p) => acc + Number(p.rawUsed), 0);
  const totalOil = productions.reduce((acc, p) => acc + Number(p.oilProduced), 0);
  const totalMeal = productions.reduce((acc, p) => acc + Number(p.mealProduced), 0);
  const totalLoss = productions.reduce((acc, p) => acc + Number(p.loss), 0);
  const totalDeficit = productions.reduce((acc, p) => acc + Number(p.deficit || 0), 0);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", background: "#f3f6f9" }}>
      <h2 style={{ color: "#1f2937" }}>🛢️ Oil Production Entry</h2>
      <button onClick={() => setView("dashboard")} style={{ marginBottom: "20px" }}>⬅️ Back</button>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="number"
          placeholder="Raw Used (kg)"
          value={rawUsed}
          onChange={e => setRawUsed(e.target.value)}
          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Oil Produced (kg)"
          value={oilProduced}
          onChange={e => setOilProduced(e.target.value)}
          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <button onClick={handleSave} style={{ background: "#ef4444", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>💾 Save</button>
      </div>

      <h3 style={{ marginTop: "20px" }}>📋 Production List</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
        <thead style={{ background: "#e5e7eb" }}>
          <tr>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Raw Used</th>
            <th style={thStyle}>Oil Produced</th>
            <th style={thStyle}>Meal Produced</th>
            <th style={thStyle}>Loss</th>
            <th style={thStyle}>Deficit</th>
          </tr>
        </thead>
        <tbody>
          {productions.map((p, i) => (
            <tr key={i} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
              <td>{p.date}</td>
              <td>{p.rawUsed}</td>
              <td>{p.oilProduced}</td>
              <td>{p.mealProduced}</td>
              <td>{p.loss}</td>
              <td>{p.deficit || 0}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold", background: "#f9fafb" }}>
            <td>🧮 Total</td>
            <td>{totalRaw}</td>
            <td>{totalOil}</td>
            <td>{totalMeal}</td>
            <td>{totalLoss}</td>
            <td>{totalDeficit}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: "8px",
  borderBottom: "2px solid #d1d5db",
  textAlign: "center",
};