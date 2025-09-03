import { useState, useEffect } from "react";

export default function OilProduction({ setView }) {
  const [materials, setMaterials] = useState([]);
  const [yields, setYields] = useState({}); // প্রতি লটের Yield Data
  const [productions, setProductions] = useState([]);

  // Yield setup
  const [selectedLot, setSelectedLot] = useState("");
  const [oilPerMon, setOilPerMon] = useState("");

  // Daily Production
  const [prodDate, setProdDate] = useState("");
  const [prodLot, setProdLot] = useState("");
  const [prodQtyKg, setProdQtyKg] = useState("");

  useEffect(() => {
    const savedMaterials = JSON.parse(localStorage.getItem("materials")) || [];
    setMaterials(savedMaterials);

    const savedYields = JSON.parse(localStorage.getItem("yields")) || {};
    setYields(savedYields);

    const savedProductions = JSON.parse(localStorage.getItem("productions")) || [];
    setProductions(savedProductions);
  }, []);

  // ১ম ভাগ → Yield Setup
  const handleYieldSave = () => {
    if (!selectedLot || !oilPerMon) return alert("লট এবং প্রতি মনের তেল লিখুন!");
    const oil = Number(oilPerMon);
    const loss = 1.5; // fixed প্রতি 40kg
    const meal = 40 - oil - loss;

    const updated = { ...yields, [selectedLot]: { oil, loss, meal } };
    setYields(updated);
    localStorage.setItem("yields", JSON.stringify(updated));

    setSelectedLot("");
    setOilPerMon("");
  };

  // ২য় ভাগ → Daily Production Entry
  const handleProductionSave = () => {
    if (!prodDate || !prodLot || !prodQtyKg) return alert("Date, Lot, Quantity দিন!");
    if (!yields[prodLot]) return alert("এই লটের Yield সেট করা হয়নি!");

    const qty = Number(prodQtyKg);
    const yieldData = yields[prodLot];

    const oil = (qty / 40) * yieldData.oil;
    const loss = (qty / 40) * yieldData.loss;
    const meal = (qty / 40) * yieldData.meal;

    const newProd = {
      date: prodDate,
      lot: prodLot,
      qty,
      oil,
      meal,
      loss,
    };

    const updated = [...productions, newProd];
    setProductions(updated);
    localStorage.setItem("productions", JSON.stringify(updated));

    // Stock থেকে minus
    const updatedMaterials = materials.map((m, i) =>
      i.toString() === prodLot
        ? { ...m, quantityKg: m.quantityKg - qty }
        : m
    );
    setMaterials(updatedMaterials);
    localStorage.setItem("materials", JSON.stringify(updatedMaterials));

    setProdDate("");
    setProdLot("");
    setProdQtyKg("");
  };

  // ৩য় ভাগ → Reports
  const totalOil = productions.reduce((sum, p) => sum + p.oil, 0);
  const totalMeal = productions.reduce((sum, p) => sum + p.meal, 0);
  const totalLoss = productions.reduce((sum, p) => sum + p.loss, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛢️ Oil Production Entry</h2>

      {/* ১ম ভাগ */}
      <h3>Yield Setup</h3>
      <select value={selectedLot} onChange={(e) => setSelectedLot(e.target.value)}>
        <option value="">-- Select Lot --</option>
        {materials.map((m, i) => (
          <option key={i} value={i}>
            {m.date} - {m.materialName} ({m.quantityKg} kg left)
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Oil per Mon (kg)"
        value={oilPerMon}
        onChange={(e) => setOilPerMon(e.target.value)}
      />
      <button onClick={handleYieldSave}>Save Yield</button>

      {/* ২য় ভাগ */}
      <h3 style={{ marginTop: "20px" }}>Daily Production</h3>
      <input type="date" value={prodDate} onChange={(e) => setProdDate(e.target.value)} />
      <select value={prodLot} onChange={(e) => setProdLot(e.target.value)}>
        <option value="">-- Select Lot --</option>
        {materials.map((m, i) => (
          <option key={i} value={i}>
            {m.date} - {m.materialName} ({m.quantityKg} kg left)
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Quantity Crushed (kg)"
        value={prodQtyKg}
        onChange={(e) => setProdQtyKg(e.target.value)}
      />
      <button onClick={handleProductionSave}>Save Production</button>

      {/* ৩য় ভাগ */}
      <h3 style={{ marginTop: "20px" }}> Production Report</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Date</th>
            <th>Lot</th>
            <th>Qty Crushed (kg)</th>
            <th>Oil (kg)</th>
            <th>Meal (kg)</th>
            <th>Loss (kg)</th>
          </tr>
        </thead>
        <tbody>
          {productions.map((p, i) => (
            <tr key={i}>
              <td>{p.date}</td>
              <td>{p.lot}</td>
              <td>{p.qty.toFixed(2)}</td>
              <td>{p.oil.toFixed(2)}</td>
              <td>{p.meal.toFixed(2)}</td>
              <td>{p.loss.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 style={{ marginTop: "20px" }}>
        ✅ Total Oil: {totalOil.toFixed(2)} kg | Meal: {totalMeal.toFixed(2)} kg | Loss: {totalLoss.toFixed(2)} kg
      </h4>

      <button onClick={() => setView("dashboard")} style={{ marginTop: "20px" }}>
        ⬅️ Back to Dashboard
      </button>
    </div>
  );
}
