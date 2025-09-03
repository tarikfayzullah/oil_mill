import { useState, useEffect } from "react";

export default function RawMaterial({ setView }) {
  const [materials, setMaterials] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // purchase form states
  const [date, setDate] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [vendorPhone, setVendorPhone] = useState("");
  const [quantityKg, setQuantityKg] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [carryingCost, setCarryingCost] = useState("");
  const [laborCost, setLaborCost] = useState("");
  const [otherCost, setOtherCost] = useState("");

  // yield states (per-lot)
  // structure: { [uid]: { oil, loss, meal } }
  const [yields, setYields] = useState({});
  const [selectedLotUid, setSelectedLotUid] = useState("");
  const [oilPerMon, setOilPerMon] = useState("");
  const [yieldEditUid, setYieldEditUid] = useState(null); // null = add, uid = edit

  // helpers
  const fmt = (n) => Number(n ?? 0).toFixed(2);
  const makeUid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // load from storage (and backfill uid if missing)
  useEffect(() => {
    const savedMaterials = JSON.parse(localStorage.getItem("materials")) || [];
    // ensure every material has uid
    let patched = false;
    const withUid = savedMaterials.map((m, i) => {
      if (!m.uid) { patched = true; return { ...m, uid: makeUid() }; }
      return m;
    });
    if (patched) localStorage.setItem("materials", JSON.stringify(withUid));
    setMaterials(withUid);

    const savedYields = JSON.parse(localStorage.getItem("yields")) || {};
    setYields(savedYields);
  }, []);

  // purchase submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !materialName || !vendorName || !quantityKg || !purchasePrice) {
      return alert("Date, Material, Vendor, Quantity & Purchase Price পূরণ করো!");
    }

    const qtyKg = Number(quantityKg);
    const qtyMon = qtyKg / 40; // 1 মন = 40 kg

    const pPrice = Number(purchasePrice);
    const cCost = Number(carryingCost || 0);
    const lCost = Number(laborCost || 0);
    const oCost = Number(otherCost || 0);

    const totalCost = qtyKg * pPrice + cCost + lCost + oCost;
    const pricePerMon = qtyMon > 0 ? totalCost / qtyMon : 0;

    const base = {
      date,
      materialName,
      vendorName,
      vendorPhone,
      quantityKg: qtyKg,
      quantityMon: qtyMon,
      purchasePrice: pPrice,
      carryingCost: cCost,
      laborCost: lCost,
      otherCost: oCost,
      totalCost,
      pricePerMon,
    };

    let updated = [...materials];
    if (editIndex !== null) {
      // keep existing uid when updating
      const prev = updated[editIndex] || {};
      updated[editIndex] = { ...base, uid: prev.uid || makeUid() };
      setEditIndex(null);
    } else {
      updated.push({ ...base, uid: makeUid() });
    }

    setMaterials(updated);
    localStorage.setItem("materials", JSON.stringify(updated));

    // reset form
    setDate(""); setMaterialName(""); setVendorName(""); setVendorPhone("");
    setQuantityKg(""); setPurchasePrice(""); setCarryingCost(""); setLaborCost(""); setOtherCost("");
  };

  const handleEdit = (i) => {
    const m = materials[i];
    setEditIndex(i);
    setDate(m.date || "");
    setMaterialName(m.materialName || "");
    setVendorName(m.vendorName || "");
    setVendorPhone(m.vendorPhone || "");
    setQuantityKg(m.quantityKg ?? "");
    setPurchasePrice(m.purchasePrice ?? "");
    setCarryingCost(m.carryingCost ?? "");
    setLaborCost(m.laborCost ?? "");
    setOtherCost(m.otherCost ?? "");
  };

  const handleDelete = (i) => {
    if (!window.confirm("আপনি কি এই এন্ট্রি মুছে দিতে চান?")) return;
    const uid = materials[i]?.uid;
    const updated = materials.filter((_, idx) => idx !== i);
    setMaterials(updated);
    localStorage.setItem("materials", JSON.stringify(updated));

    // remove yield for this lot if exists
    if (uid && yields[uid]) {
      const y2 = { ...yields };
      delete y2[uid];
      setYields(y2);
      localStorage.setItem("yields", JSON.stringify(y2));
    }
  };

  // Yield Save/Update
  const handleYieldSave = () => {
    if (!selectedLotUid || !oilPerMon) return alert("Lot এবং প্রতি মনের তেল লিখুন!");
    const oil = Number(oilPerMon);
    if (oil <= 0) return alert("Oil per Mon সঠিকভাবে দিন।");
    const loss = 1.5; // fixed প্রতি মন
    const mealRaw = 40 - oil - loss;
    const meal = mealRaw < 0 ? 0 : mealRaw; // safety

    const updated = { ...yields, [selectedLotUid]: { oil, loss, meal } };
    setYields(updated);
    localStorage.setItem("yields", JSON.stringify(updated));

    setSelectedLotUid("");
    setOilPerMon("");
    setYieldEditUid(null);
  };

  const handleYieldEdit = (uid) => {
    const y = yields[uid];
    setSelectedLotUid(uid);
    setOilPerMon(String(y.oil));
    setYieldEditUid(uid);
  };

  const handleYieldDelete = (uid) => {
    if (!window.confirm("এই Yield মুছে ফেলবেন?")) return;
    const updated = { ...yields };
    delete updated[uid];
    setYields(updated);
    localStorage.setItem("yields", JSON.stringify(updated));
    if (yieldEditUid === uid) {
      setSelectedLotUid("");
      setOilPerMon("");
      setYieldEditUid(null);
    }
  };

  const lotLabel = (m) =>
    `${m.date} - ${m.materialName} (${fmt(m.quantityKg)} kg)`; // for dropdown
  const findMaterialByUid = (uid) => materials.find((m) => m.uid === uid);

  // live preview for yield input
  const preview = (() => {
    const oil = Number(oilPerMon || 0);
    const loss = oil > 0 ? 1.5 : 0;
    const meal = oil > 0 ? Math.max(0, 40 - oil - loss) : 0;
    return { oil, loss, meal, total: oil + loss + meal };
  })();

  return (
    <div style={{ padding: "20px" }}>
      <h2>🌾 Raw Material Entry</h2>

      {/* Purchase Form */}
      <form onSubmit={handleSubmit}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input type="text" placeholder="Material Name" value={materialName} onChange={e => setMaterialName(e.target.value)} />
        <input type="text" placeholder="Vendor Name" value={vendorName} onChange={e => setVendorName(e.target.value)} />
        <input type="text" placeholder="Vendor Phone" value={vendorPhone} onChange={e => setVendorPhone(e.target.value)} />
        <input type="number" placeholder="Quantity (kg)" value={quantityKg} onChange={e => setQuantityKg(e.target.value)} />
        <input type="number" placeholder="Purchase Price (per kg)" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} />
        <input type="number" placeholder="Carrying Cost" value={carryingCost} onChange={e => setCarryingCost(e.target.value)} />
        <input type="number" placeholder="Labor Cost" value={laborCost} onChange={e => setLaborCost(e.target.value)} />
        <input type="number" placeholder="Other Cost" value={otherCost} onChange={e => setOtherCost(e.target.value)} />
        <button type="submit">{editIndex !== null ? "Update" : "Add Material"}</button>
      </form>

      <button onClick={() => setView("dashboard")} style={{ marginTop: "10px" }}>⬅️ Back to Dashboard</button>

      {/* Yield Setup (inside Raw Material page) */}
      <h3 style={{ marginTop: "30px" }}>⚙️ Yield Setup</h3>
      <div>
        <select
          value={selectedLotUid}
          onChange={(e) => setSelectedLotUid(e.target.value)}
          disabled={!!yieldEditUid} // editing: lock lot
        >
          <option value="">-- Select Lot --</option>
          {materials
            .filter((m) => !yields[m.uid]) // only those without yield
            .map((m) => (
              <option key={m.uid} value={m.uid}>
                {lotLabel(m)}
              </option>
            ))}
          {yieldEditUid && (
            <option value={yieldEditUid}>
              {lotLabel(findMaterialByUid(yieldEditUid) || { date: "", materialName: "", quantityKg: 0 })}
            </option>
          )}
        </select>
        <input
          type="number"
          placeholder="Oil per Mon (kg)"
          value={oilPerMon}
          onChange={(e) => setOilPerMon(e.target.value)}
        />
        <button onClick={handleYieldSave}>
          {yieldEditUid ? "Update Yield" : "Save Yield"}
        </button>
        {/* live preview */}
        <div style={{ marginTop: "8px", fontSize: "14px" }}>
          Preview — Oil: <b>{fmt(preview.oil)}</b> kg, Meal: <b>{fmt(preview.meal)}</b> kg, Loss: <b>{fmt(preview.loss)}</b> kg, Total: <b>{fmt(preview.total)}</b> kg
        </div>
      </div>

      {/* Yield Report */}
      <h4 style={{ marginTop: "20px" }}>✅ Yield Report</h4>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Lot</th>
            <th>Oil (kg/mon)</th>
            <th>Meal (kg/mon)</th>
            <th>Loss (kg/mon)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(yields).map((uid) => {
            const m = findMaterialByUid(uid);
            return (
              <tr key={uid}>
                <td>{m ? lotLabel(m) : uid}</td>
                <td>{fmt(yields[uid].oil)}</td>
                <td>{fmt(yields[uid].meal)}</td>
                <td>{fmt(yields[uid].loss)}</td>
                <td>
                  <button onClick={() => handleYieldEdit(uid)}>Edit</button>{" "}
                  <button onClick={() => handleYieldDelete(uid)}>Delete</button>
                </td>
              </tr>
            );
          })}
          {Object.keys(yields).length === 0 && (
            <tr><td colSpan="5" style={{ textAlign: "center" }}>No yield set yet</td></tr>
          )}
        </tbody>
      </table>

      {/* Materials List (purchase history) */}
      <h3 style={{ marginTop: "30px" }}>📋 Materials List</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Date</th>
            <th>Material</th>
            <th>Vendor</th>
            <th>Phone</th>
            <th>Quantity (kg)</th>
            <th>Quantity (Mon)</th>
            <th>Purchase Price (per kg)</th>
            <th>Carrying Cost</th>
            <th>Labor Cost</th>
            <th>Other Cost</th>
            <th>Total Cost</th>
            <th>Price per Mon</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m, i) => (
            <tr key={m.uid || i}>
              <td>{m.date}</td>
              <td>{m.materialName}</td>
              <td>{m.vendorName}</td>
              <td>{m.vendorPhone}</td>
              <td>{fmt(m.quantityKg)}</td>
              <td>{fmt(m.quantityMon)}</td>
              <td>{fmt(m.purchasePrice)}</td>
              <td>{fmt(m.carryingCost)}</td>
              <td>{fmt(m.laborCost)}</td>
              <td>{fmt(m.otherCost)}</td>
              <td>{fmt(m.totalCost)}</td>
              <td>{fmt(m.pricePerMon)}</td>
              <td>
                <button onClick={() => handleEdit(i)}>Edit</button>{" "}
                <button onClick={() => handleDelete(i)}>Delete</button>
              </td>
            </tr>
          ))}
          {materials.length === 0 && (
            <tr><td colSpan="13" style={{ textAlign: "center" }}>No purchases yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
