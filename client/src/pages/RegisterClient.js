import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RegisterClient.css"; // if you're using a separate CSS file

function RegisterClient() {
  const [clients, setClients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: ""
  });
  const [selectedPrograms, setSelectedPrograms] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/clients").then(res => setClients(res.data));
    axios.get("http://localhost:5000/api/programs").then(res => setPrograms(res.data));
  }, []);

  const handleRegisterClient = () => {
    axios.post("http://localhost:5000/api/clients", form).then((res) => {
      const clientId = res.data.id;

      selectedPrograms.forEach(programId => {
        axios.post("http://localhost:5000/api/enrollments", {
          client_id: clientId,
          program_id: parseInt(programId)
        });
      });

      setClients([...clients, { ...res.data, programs: selectedPrograms }]);
      setForm({ first_name: "", last_name: "", email: "", phone: "", date_of_birth: "" });
      setSelectedPrograms([]);
    });
  };

  return (
    <div className="section">
      <h2>Register New Client</h2>
      <div className="form-group">
        <input type="text" placeholder="First Name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
        <input type="text" placeholder="Last Name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
        
        <label>Select Programs:</label>
        <select multiple value={selectedPrograms} onChange={(e) => setSelectedPrograms(Array.from(e.target.selectedOptions, (opt) => opt.value))}>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <button onClick={handleRegisterClient}>Register Client</button>
      </div>
    </div>
  );
}

export default RegisterClient;
