import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './ClientProfile.css';

function ClientProfile() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);

  useEffect(() => {
    // Fetch client profile
    axios.get(`http://localhost:5000/api/clients/${id}`).then((res) => {
      setClient(res.data);
      setSelectedPrograms(res.data.programs || []);
    });

    // Fetch all available programs for the multi-select dropdown
    axios.get("http://localhost:5000/api/programs").then((res) => {
      setPrograms(res.data);
    });
  }, [id]);

  const handleProgramChange = (event) => {
    const { value, checked } = event.target;

    setSelectedPrograms((prev) =>
      checked ? [...prev, value] : prev.filter((program) => program !== value)
    );
  };

  const handleEnroll = () => {
    if (selectedPrograms.length === 0) {
      alert("Please select at least one program to enroll.");
      return;
    }

    // Map selected program IDs to program names
    const selectedProgramNames = selectedPrograms.map((programId) => {
      const program = programs.find((p) => p.id.toString() === programId.toString());
      return program?.name;
    }).filter(name => name); // remove undefined

    axios
      .post("http://localhost:5000/api/enrollments/multiple", {
        client_id: id,
        program_names: selectedProgramNames,
      })
      .then(() => {
        alert("Client successfully enrolled in programs.");
      })
      .catch((err) => {
        alert("Error enrolling client: " + err.message);
      });
  };

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

      <div className="program-selection">
        <h4>Select Programs to Enroll</h4>
        <div className="program-list">
          {programs.map((program) => (
            <div key={program.id}>
              <input
                type="checkbox"
                value={program.id}
                checked={selectedPrograms.includes(program.id.toString())}
                onChange={handleProgramChange}
              />
              <label>{program.name}</label>
            </div>
          ))}
        </div>
        <button onClick={handleEnroll}>Enroll in Selected Programs</button>
      </div>
    </div>
  );
}

export default ClientProfile;
