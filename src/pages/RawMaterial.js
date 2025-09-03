import { useState, useEffect } from "react";

export default function RawMaterial({ setView }) {
  const [materialName, setMaterialName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [baseCost, setBaseCost] = useState("");
  const [additionalCost, setAdditionalCost] = useState("");
  const [oilPer40kg, setOilPer40kg] = useState("");
  const [mealPer40kg, setMealPer40kg] = useState("");
  const [lossPer40kg, setLossPer40kg] = useState("");
  const [materials, setMaterials] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("materials")) || [];
    setMaterials(saved.map(m => ({
      ...m,
      quantity: Number(m.quantity),
      baseCost: Number(m.baseCost),
      additionalCost: Number(m.additionalCost),
      totalCost: Number(m.totalCost),
      oilPer40kg: Number(m.oilPer40kg),
      mealPer40kg: Number(m.mealPer40kg),
      lossPer40kg: Number(m.lossPer40kg)
    })));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!materialName || !quantity || !baseCost) return alert("সব ফিল্ড পূরণ করো!");

    const totalCost = Number(baseCost) + Number(additionalCost || 0);
    const newMaterial = {
      materialName,
      quantity: Number(quantity),
      baseCost: Number(baseCost),
      additionalCost: Number(additionalCost || 0),
      totalCost,
      oilPer40kg: Number(oilPer40kg),
      mealPer40kg: Number(mealPer40kg),
      lossPer40kg: Number(lossPer40kg),
    };

    let updatedMaterials = [...materials];
    if (editIndex !== null) {
      updatedMaterials[editIndex] = newMaterial;
      setEditIndex(null);
    } else {
      updatedMaterials.push(newMaterial);
    }

    setMaterials(updatedMaterials);
    localStorage.setItem("materials", JSON.stringify(updatedMaterials));

    setMaterialName("");
    setQuantity("");
    setBaseCost("");
    setAdditionalCost("");
    setOilPer40kg("");
    setMealPer40kg("");
    setLossPer40kg("");
  };

  const handleEdit = (index) => {
    const mat = materials[index];
    setMaterialName(mat.materialName);
    setQuantity(mat.quantity);
    setBaseCost(mat.baseCost);
    setAdditionalCost(mat.additionalCost);
    setOilPer40kg(mat.oilPer40kg);
    setMealPer40kg(mat.mealPer40kg);
    setLossPer40kg(mat.lossPer40kg);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (!window.confirm("আপনি কি এই এন্ট্রি মুছে দিতে চান?")) return;
    const updated = materials.filter((_, i) => i !== index);
    setMaterials(updated);
    localStorage.setItem("materials", JSON.stringify(updated));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🌾 Raw Material Entry</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Material Name" value={materialName} onChange={e => setMaterialName(e.target.value)} />
        &nbsp;
        <input type="number" placeholder="Quantity (kg)" value={quantity} onChange={e => setQuantity(e.target.value)} />
        &nbsp;
        <input type="number" placeholder="Base Cost (BDT)" value={baseCost} onChange={e => setBaseCost(e.target.value)} />
        &nbsp;
        <input type="number" placeholder="Additional Cost (BDT)" value={additionalCost} onChange={e => setAdditionalCost(e.target.value)} />
        <br /><br />
        <input type="number" placeholder="Oil per 40kg (kg)" value={oilPer40kg} onChange={e => setOilPer40kg(e.target.value)} />
        &nbsp;
        <input type="number" placeholder="Meal per 40kg (kg)" value={mealPer40kg} onChange={e => setMealPer40kg(e.target.value)} />
        &nbsp;
        <input type="number" placeholder="Loss per 40kg (kg)" value={lossPer40kg} onChange={e => setLossPer40kg(e.target.value)} />
        &nbsp;
        <button type="submit">{editIndex !== null ? "Update" : "Add"}</button>
      </form>

      <button onClick={() => setView("dashboard")} style={{ marginTop: "10px" }}>⬅️ Back to Dashboard</button>

      <h3>📋 Material List</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Material</th>
            <th>Quantity (kg)</th>
            <th>Base Cost</th>
            <th>Additional Cost</th>
            <th>Total Cost</th>
            <th>Oil/40kg</th>
            <th>Meal/40kg</th>
            <th>Loss/40kg</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m, i) => (
            <tr key={i}>
              <td>{m.materialName}</td>
              <td>{m.quantity.toFixed(2)}</td>
              <td>{m.baseCost.toFixed(2)}</td>
              <td>{m.additionalCost.toFixed(2)}</td>
              <td>{m.totalCost.toFixed(2)}</td>
              <td>{m.oilPer40kg.toFixed(2)}</td>
              <td>{m.mealPer40kg.toFixed(2)}</td>
              <td>{m.lossPer40kg.toFixed(2)}</td>
              <td>
                <button onClick={() => handleEdit(i)}>Edit</button> &nbsp;
                <button onClick={() => handleDelete(i)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
