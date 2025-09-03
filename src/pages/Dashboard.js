import { useState, useEffect } from "react";

export default function Dashboard({ setView, setEditProductionIndex }) {
  const [productions, setProductions] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("productions")) || [];
    setProductions(saved.map(p => ({
      ...p,
      quantity: Number(p.quantity),
      oilProduced: Number(p.oilProduced),
      mealProduced: Number(p.mealProduced),
      loss: Number(p.loss),
      productionCost: Number(p.productionCost),
      totalCost: Number(p.totalCost)
    })));
  }, []);

  const handleEdit = (index) => {
    setEditProductionIndex(index);
    setView("oilProduction");
  };

  const handleDelete = (index) => {
    if (!window.confirm("আপনি কি এই এন্ট্রি মুছে দিতে চান?")) return;
    const updated = productions.filter((_, i) => i !== index);
    setProductions(updated);
    localStorage.setItem("productions", JSON.stringify(updated));
  };

  const summary = productions.reduce((acc, p) => {
    acc.quantity += p.quantity;
    acc.oil += p.oilProduced;
    acc.meal += p.mealProduced;
    acc.loss += p.loss;
    acc.cost += p.totalCost;
    return acc;
  }, { quantity: 0, oil: 0, meal: 0, loss: 0, cost: 0 });

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Dashboard</h2>
      <button onClick={() => setView("rawMaterial")}>🌾 Raw Material Entry</button> &nbsp;
      <button onClick={() => setView("oilProduction")}>🛢️ Oil Production Entry</button>

      <h3 style={{ marginTop: "20px" }}>📋 Production List</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Date</th>
            <th>Material</th>
            <th>Quantity</th>
            <th>Oil Produced</th>
            <th>Meal Produced</th>
            <th>Loss</th>
            <th>Production Cost</th>
            <th>Total Cost</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productions.map((p, i) => (
            <tr key={i}>
              <td>{p.date}</td>
              <td>{p.materialName}</td>
              <td>{p.quantity.toFixed(2)}</td>
              <td>{p.oilProduced.toFixed(2)}</td>
              <td>{p.mealProduced.toFixed(2)}</td>
              <td>{p.loss.toFixed(2)}</td>
              <td>{p.productionCost.toFixed(2)}</td>
              <td>{p.totalCost.toFixed(2)}</td>
              <td>
                <button onClick={() => handleEdit(i)}>Edit</button> &nbsp;
                <button onClick={() => handleDelete(i)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: "20px" }}>📌 Summary</h3>
      <p>Total Quantity Used: {summary.quantity.toFixed(2)} kg</p>
      <p>Total Oil Produced: {summary.oil.toFixed(2)} kg</p>
      <p>Total Meal Produced: {summary.meal.toFixed(2)} kg</p>
      <p>Total Loss: {summary.loss.toFixed(2)} kg</p>
      <p>Total Cost: {summary.cost.toFixed(2)} BDT</p>
    </div>
  );
}
