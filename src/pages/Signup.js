import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", { name, email, password });
      alert("Signup successful! Login now.");
      navigate("/login");
    } catch (err) {
      alert("Signup failed: " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px" }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "10px", width: "300px" }}>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" style={{ padding: "10px", background: "#4caf50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Sign Up</button>
      </form>
      <p style={{ marginTop: "10px" }}>Already have an account? <Link to="/login" style={{ color: "#4caf50" }}>Login</Link></p>
    </div>
  );
}
