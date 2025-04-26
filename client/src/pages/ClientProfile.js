import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './ClientProfile.css';

function ClientProfile() {
  const { id } = useParams();
  const [client, setClient] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/clients/${id}`).then((res) => {
      setClient(res.data);
    });
  }, [id]);

  if (!client) {
    return <div>Loading client profile...</div>;
  }

  return (
    <div className="section">
      <h2>Client Profile</h2>
      <h3>{client.first_name} {client.last_name}</h3>
      <p>Email: {client.email}</p>
      <p>Phone: {client.phone}</p>
      <p>Date of Birth: {client.date_of_birth}</p>
      <p>Enrolled Programs: {client.programs && client.programs.length > 0 ? client.programs.join(", ") : "None"}</p>
    </div>
  );
}

export default ClientProfile;
