import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RawMaterial() {
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState({
    supplierName: "",
    supplierPhone: "",
    supplierAddress: "",
    materialName: "",
    quantity: ""
  });
  const navigate = useNavigate();

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
      if (!form.supplierName || !form.materialName || !form.quantity) {
        return alert("Supplier, Material এবং Quantity অবশ্যই দিতে হবে!");
      }
      await axios.post("http://localhost:5000/api/raw-materials", {
        ...form,
        quantity: Number(form.quantity)
      });
      setForm({ supplierName: "", supplierPhone: "", supplierAddress: "", materialName: "", quantity: "" });
      fetchMaterials();
    } catch (err) {
      console.error(err);
      alert("Save failed!");
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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f9", minHeight: "100vh" }}>
      <h2 style={{ color: "#333" }}>🌾 Raw Material Entry</h2>
      
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          margin: "10px 0",
          padding: "10px 20px",
          backgroundColor: "#3354e7ff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        ⬅️ Back to Dashboard
      </button>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input placeholder="Supplier Name" name="supplierName" value={form.supplierName} onChange={handleChange} style={inputStyle}/>
        <input placeholder="Supplier Phone" name="supplierPhone" value={form.supplierPhone} onChange={handleChange} style={inputStyle}/>
        <input placeholder="Supplier Address" name="supplierAddress" value={form.supplierAddress} onChange={handleChange} style={inputStyle}/>
        <input placeholder="Material Name" name="materialName" value={form.materialName} onChange={handleChange} style={inputStyle}/>
        <input placeholder="Quantity (kg)" name="quantity" type="number" value={form.quantity} onChange={handleChange} style={inputStyle}/>
        <button onClick={handleSave} style={saveBtnStyle}>💾 Save</button>
      </div>

      <h3 style={{ marginTop: "30px" }}>📋 Material List</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
        <thead style={{ background: "#e5e7eb" }}>
          <tr>
            <th style={thStyle}>Supplier Name</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Address</th>
            <th style={thStyle}>Material</th>
            <th style={thStyle}>Quantity</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m) => (
            <tr key={m._id} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
              <td>{m.supplierName}</td>
              <td>{m.supplierPhone}</td>
              <td>{m.supplierAddress}</td>
              <td>{m.materialName}</td>
              <td>{m.quantity.toFixed(2)}</td>
              <td>
                <button onClick={() => handleDelete(m._id)} style={deleteBtnStyle}>❌ Delete</button>
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

const inputStyle = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  minWidth: "150px"
};

const saveBtnStyle = {
  background: "#4caf50",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  cursor: "pointer"
};

const deleteBtnStyle = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "4px 8px",
  borderRadius: "4px",
  cursor: "pointer"
};

const thStyle = {
  padding: "10px",
  border: "1px solid #ddd",
};
