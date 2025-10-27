import React, { useState } from "react";
import { api } from "../api";

function AddDiseaseForm({ onAdded }) {
  const [name, setName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/diseases", { name, symptoms });
      setName("");
      setSymptoms("");
      setMessage("✅ Disease added successfully!");
      if (onAdded) onAdded(); // auto refresh parent list
    } catch (error) {
      console.error("Error saving disease:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 2000); // hide message after 2s
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-4 p-4 mb-4 border border-light mx-auto" style={{ maxWidth: "700px" }}>
      <h4 className="text-center text-primary fw-bold mb-3">
        <i className="bi bi-heart-pulse me-2"></i>Add Disease
      </h4>

      {message && (
        <div className="alert alert-success text-center fw-semibold py-2">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-bold text-secondary">Disease Name</label>
          <input
            type="text"
            className="form-control border-primary-subtle rounded-3"
            placeholder="e.g. Foot and Mouth Disease"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold text-secondary">Symptoms</label>
          <textarea
            className="form-control border-primary-subtle rounded-3"
            placeholder="List symptoms separated by commas"
            rows="3"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="text-center">
          <button
            className="btn btn-primary px-4 py-2 fw-semibold rounded-pill"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddDiseaseForm;
