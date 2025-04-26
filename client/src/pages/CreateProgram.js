import React, { useState } from "react";
import axios from "axios";
import "./CreateProgram.css"; // optional if separating styles

function CreateProgram() {
  const [newProgram, setNewProgram] = useState("");

  const handleAddProgram = () => {
    if (newProgram.trim() === "") return;
    axios.post("http://localhost:5000/api/programs", { name: newProgram }).then(() => {
      setNewProgram("");
    });
  };

  return (
    <div className="section">
      <h2>Create Health Program</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Program Name"
          value={newProgram}
          onChange={(e) => setNewProgram(e.target.value)}
        />
        <button onClick={handleAddProgram}>Create Program</button>
      </div>
    </div>
  );
}

export default CreateProgram;
