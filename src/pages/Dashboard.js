import { useState, useEffect } from "react";

export default function Dashboard({ setView }) {
  const [productions, setProductions] = useState([]);

  useEffect(() => {
    const savedProductions = JSON.parse(localStorage.getItem("productions")) || [];
    setProductions(savedProductions);
  }, []);

  const handleDelete = (index) => {
    if (!window.confirm("আপনি কি এই এন্ট্রি মুছে দিতে চান?")) return;
    const updated = productions.filter((_, i) => i !== index);
    setProductions(updated);
    localStorage.setItem("productions", JSON.stringify(updated));
  };

  const handleEdit = (index) => {
    const prod = productions[index];
    const newQuantity = prompt("Quantity Used (kg)", prod.quantity);
    if (newQuantity === null) return;

    const factor = Number(newQuantity) / Number(prod.quantity);
    const updatedProd = {
      ...prod,
      quantity: Number(newQuantity),
      oilProduced: prod.oilProduced * factor,
      mealProduced: prod.mealProduced * factor,
      loss: prod.loss * factor,
      totalCost: prod.totalCost * factor
    };

    const updatedProductions = [...productions];
    updatedProductions[index] = updatedProd;
    setProductions(updatedProductions);
    localStorage.setItem("productions", JSON.stringify(updatedProductions));
  };

  // Summary calculation
  const totalQuantity = productions.reduce((sum, p) => sum + p.quantity, 0);
  const totalOil = productions.reduce((sum, p) => sum + p.oilProduced, 0);
  const totalMeal = productions.reduce((sum, p) => sum + p.mealProduced, 0);
  const totalLoss = productions.reduce((sum, p) => sum + p.loss, 0);
  const totalCost = productions.reduce((sum, p) => sum + p.totalCost, 0);

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
            <th>Quantity Used</th>
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

      <h3 style={{ marginTop: "20px" }}>📌 Production Summary</h3>
      <p>Total Quantity Used: {totalQuantity.toFixed(2)} kg</p>
      <p>Total Oil Produced: {totalOil.toFixed(2)} kg</p>
      <p>Total Meal Produced: {totalMeal.toFixed(2)} kg</p>
      <p>Total Loss: {totalLoss.toFixed(2)} kg</p>
      <p>Total Cost: {totalCost.toFixed(2)} BDT</p>
    </div>
  );
}
