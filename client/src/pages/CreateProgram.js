import React, { useState } from "react";
import axios from "axios";
import "./CreateProgram.css"; // Optional if separating styles

function CreateProgram() {
  const [newProgram, setNewProgram] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [message, setMessage] = useState(""); // For success or error message

  const handleAddProgram = () => {
    if (!newProgram.trim() || !description.trim() || !duration.trim()) {
      setMessage("Please fill in all the fields.");
      return;
    }

    axios
      .post("http://localhost:5000/api/programs", {
        name: newProgram,
        description,
        duration,
      })
      .then(() => {
        setMessage("Program created successfully!");
        setNewProgram("");
        setDescription("");
        setDuration("");
      })
      .catch((error) => {
        setMessage("Error creating program. Please try again.");
        console.error("Error:", error);
      });
  };

  return (
    <div className="section">
      <h2>Create Health Program</h2>
      {message && <p className="message">{message}</p>}
      <div className="form-group">
        <label htmlFor="program-name">Program Name</label>
        <input
          id="program-name"
          type="text"
          placeholder="Program Name"
          value={newProgram}
          onChange={(e) => setNewProgram(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Enter program description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="duration">Duration</label>
        <input
          id="duration"
          type="text"
          placeholder="Program Duration (e.g., 4 weeks)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>

      <button onClick={handleAddProgram}>Create Program</button>
    </div>
  );
}

export default CreateProgram;
