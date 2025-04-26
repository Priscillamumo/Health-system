import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // ADD THIS
import './ClientList.css';

function ClientList() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/clients").then((res) => {
      setClients(res.data);
    });
  }, []);

  return (
    <div className="section">
      <h2>Client List</h2>
      <ul>
        {clients.map((c, index) => (
          <li key={index}>
            {/* Make the name clickable */}
            <h3>
              <Link to={`/client/${c.id}`} className="client-link">
                {c.first_name} {c.last_name}
              </Link>
            </h3>
            <p>Email: {c.email} | Phone: {c.phone}</p>
            <p>DOB: {c.date_of_birth}</p>
            <p>Programs: {c.programs ? c.programs.join(", ") : "None"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClientList;
