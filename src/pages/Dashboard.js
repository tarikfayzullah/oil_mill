import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard({ setView }) {
  const [currentStock, setCurrentStock] = useState({ raw: 0, oil: 0, meal: 0 });

  const fetchStock = async () => {
    try {
      // Raw Material Entry
      const rawRes = await axios.get("http://localhost:5000/api/raw-materials");
      const rawEntries = rawRes.data.data;
      const totalRawPurchased = rawEntries.reduce((acc, r) => acc + Number(r.quantity), 0);

      // Oil Production Entry
      const oilRes = await axios.get("http://localhost:5000/api/oil-production");
      const oilEntries = oilRes.data.data;

      let totalRawUsed = 0;
      let totalOilProduced = 0;
      let totalMealProduced = 0;

      oilEntries.forEach(p => {
        totalRawUsed += Number(p.rawUsed);
        totalOilProduced += Number(p.oilProduced);
        totalMealProduced += Number(p.mealProduced);
      });

      // Current stock calculation
      const rawStock = totalRawPurchased - totalRawUsed;
      const oilStock = totalOilProduced;
      const mealStock = totalMealProduced;

      setCurrentStock({ raw: rawStock, oil: oilStock, meal: mealStock });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStock();
    const interval = setInterval(fetchStock, 5000); // 5 সেকেন্ডে আপডেট
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f9", minHeight: "100vh" }}>
      <h2 style={{ color: "#333" }}>📊 Dashboard</h2>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setView("rawMaterial")}
          style={{ marginRight: "10px", padding: "8px 16px", backgroundColor: "#4caf50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          🌾 Raw Material Entry
        </button>
        <button
          onClick={() => setView("oilProduction")}
          style={{ padding: "8px 16px", backgroundColor: "#2196f3", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          🛢️ Oil Production Entry
        </button>
      </div>

      <h3 style={{ color: "#555" }}>📦 Current Stock</h3>
      <table
        style={{
          width: "60%",
          borderCollapse: "collapse",
          marginTop: "10px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#2196f3", color: "#fff" }}>
            <th style={thStyle}>Raw Mustard (মন)</th>
            <th style={thStyle}>Oil (কেজি)</th>
            <th style={thStyle}>Meal (কেজি)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>{currentStock.raw}</td>
            <td style={tdStyle}>{currentStock.oil}</td>
            <td style={tdStyle}>{currentStock.meal}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  textAlign: "center",
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  textAlign: "center",
};