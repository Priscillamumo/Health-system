import React, { useState } from "react";
import axios from "axios";
import "./SearchClients.css"; // optional: if you separate the CSS

function SearchClients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/clients?search=${searchQuery}`);
      setClients(res.data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div className="section">
      <h2>Search Clients</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <ul className="client-list">
        {clients.map((c, index) => (
          <li key={index} className="client-card">
            <h3>{c.first_name} {c.last_name}</h3>
            <p>Email: {c.email} | Phone: {c.phone}</p>
            <p>DOB: {c.date_of_birth}</p>
            <p>Programs: {c.programs ? c.programs.join(", ") : "None"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchClients;
