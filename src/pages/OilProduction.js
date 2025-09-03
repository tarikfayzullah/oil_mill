import { useState, useEffect } from "react";

export default function OilProduction({ setView }) {
  const [materialName, setMaterialName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [productionCost, setProductionCost] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [productions, setProductions] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    const savedMaterials = JSON.parse(localStorage.getItem("materials")) || [];
    setRawMaterials(savedMaterials);

    const savedProductions = JSON.parse(localStorage.getItem("productions")) || [];
    setProductions(savedProductions);
  }, []);

  const handleMaterialChange = (e) => {
    setMaterialName(e.target.value);
    const mat = rawMaterials.find((m) => m.materialName === e.target.value);
    setSelectedMaterial(mat || null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!materialName || !quantity || !productionCost) return alert("সব ফিল্ড পূরণ করো!");

    const factor = Number(quantity) / 40;
    const oilProduced = factor * selectedMaterial.oilPer40kg;
    const mealProduced = factor * selectedMaterial.mealPer40kg;
    const loss = factor * selectedMaterial.lossPer40kg;
    const totalCost = selectedMaterial.totalCost + Number(productionCost);

    const newProduction = {
      materialName,
      quantity,
      oilProduced,
      mealProduced,
      loss,
      productionCost,
      totalCost,
      date,
    };

    const updatedProductions = [...productions, newProduction];
    setProductions(updatedProductions);
    localStorage.setItem("productions", JSON.stringify(updatedProductions));

    setMaterialName("");
    setQuantity("");
    setProductionCost("");
    setSelectedMaterial(null);
    setDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛢️ Oil Production Entry</h2>
      <form onSubmit={handleSubmit}>
        <select value={materialName} onChange={handleMaterialChange}>
          <option value="">Select Material</option>
          {rawMaterials.map((m, i) => (
            <option key={i} value={m.materialName}>{m.materialName}</option>
          ))}
        </select>
        &nbsp;
        <input type="number" placeholder="Quantity Used (kg)" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        &nbsp;
        <input type="number" placeholder="Production Cost (BDT)" value={productionCost} onChange={(e) => setProductionCost(e.target.value)} />
        &nbsp;
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        &nbsp;
        <button type="submit">Add</button>
      </form>

      <button onClick={() => setView("dashboard")} style={{ marginTop: "10px" }}>⬅️ Back to Dashboard</button>

      {selectedMaterial && quantity && (
        <div style={{ marginTop: "10px" }}>
          <strong>Preview:</strong><br />
          Oil Produced: {(Number(quantity)/40*selectedMaterial.oilPer40kg).toFixed(2)} kg<br />
          Meal Produced: {(Number(quantity)/40*selectedMaterial.mealPer40kg).toFixed(2)} kg<br />
          Loss: {(Number(quantity)/40*selectedMaterial.lossPer40kg).toFixed(2)} kg
        </div>
      )}

      <h3>📋 Production List</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Date</th>
            <th>Material</th>
            <th>Quantity Used (kg)</th>
            <th>Oil Produced (kg)</th>
            <th>Meal Produced (kg)</th>
            <th>Loss (kg)</th>
            <th>Production Cost</th>
            <th>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {productions.map((p, i) => (
            <tr key={i}>
              <td>{p.date}</td>
              <td>{p.materialName}</td>
              <td>{p.quantity}</td>
              <td>{p.oilProduced.toFixed(2)}</td>
              <td>{p.mealProduced.toFixed(2)}</td>
              <td>{p.loss.toFixed(2)}</td>
              <td>{p.productionCost}</td>
              <td>{p.totalCost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
