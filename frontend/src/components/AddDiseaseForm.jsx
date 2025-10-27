import React, { useState } from "react";
import { api } from "../api";

function AddDiseaseForm({ onAdded }) {
  const [name, setName] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/diseases", { name, symptoms });
    setName("");
    setSymptoms("");
    onAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
      <h4>Add Disease</h4>
      <div className="mb-3">
        <label className="form-label">Disease Name</label>
        <input
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Symptoms</label>
        <textarea
          className="form-control"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          required
        />
      </div>
      <button className="btn btn-primary" type="submit">
        Save
      </button>
    </form>
  );
}

export default AddDiseaseForm;
