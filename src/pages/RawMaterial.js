import { useState, useEffect } from "react";
import axios from "axios";

export default function RawMaterial({ setView }) {
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState({
    supplierName: "",
    supplierPhone: "",
    supplierAddress: "",
    materialName: "",
    quantity: ""
  });

  const fetchMaterials = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/raw-materials");
      setMaterials(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.post("http://localhost:5000/api/raw-materials", {
        ...form,
        quantity: Number(form.quantity)
      });
      setForm({ supplierName: "", supplierPhone: "", supplierAddress: "", materialName: "", quantity: "" });
      fetchMaterials();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("আপনি কি এই এন্ট্রি মুছে দিতে চান?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/raw-materials/${id}`);
      fetchMaterials();
    } catch (err) {
      console.error(err);
    }
  };

  const totalStock = materials.reduce((acc, m) => acc + m.quantity, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🌾 Raw Material Entry</h2>
      <button onClick={() => setView("dashboard")}>⬅️ Back to Dashboard</button>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input placeholder="Supplier Name" name="supplierName" value={form.supplierName} onChange={handleChange} />
        <input placeholder="Supplier Phone" name="supplierPhone" value={form.supplierPhone} onChange={handleChange} />
        <input placeholder="Supplier Address" name="supplierAddress" value={form.supplierAddress} onChange={handleChange} />
        <input placeholder="Material Name" name="materialName" value={form.materialName} onChange={handleChange} />
        <input placeholder="Quantity (kg)" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
        <button onClick={handleSave} style={{ background: "#4caf50", color: "white", padding: "8px 16px", border: "none", borderRadius: "6px", cursor: "pointer" }}>💾 Save</button>
      </div>

      <h3 style={{ marginTop: "30px" }}>📋 Material List</h3>
      <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#e5e7eb" }}>
          <tr>
            <th>Supplier Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Material</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m) => (
            <tr key={m._id}>
              <td>{m.supplierName}</td>
              <td>{m.supplierPhone}</td>
              <td>{m.supplierAddress}</td>
              <td>{m.materialName}</td>
              <td>{m.quantity.toFixed(2)}</td>
              <td>
                <button onClick={() => handleDelete(m._id)} style={{ background: "#ef4444", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}>❌ Delete</button>
              </td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold", background: "#f9fafb" }}>
            <td colSpan="4" style={{ textAlign: "center" }}>Total Stock</td>
            <td colSpan="2" style={{ textAlign: "center" }}>{totalStock.toFixed(2)} kg</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}