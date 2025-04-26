import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // ADD THIS
import './ClientList.css';

function ClientList() {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query

  useEffect(() => {
    // Fetch the clients when the component mounts
    axios.get("http://localhost:5000/api/clients?search=" + searchQuery)
      .then((res) => {
        setClients(res.data);
      });
  }, [searchQuery]); // Dependency array ensures fetching whenever searchQuery changes

  return (
    <div className="section">
      <h2>Client List</h2>
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update the search query
        className="search-input"
      />
      <ul>
        {clients.length > 0 ? (
          clients.map((c, index) => (
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
          ))
        ) : (
          <p>No clients found</p>
        )}
      </ul>
    </div>
  );
}

export default ClientList;
