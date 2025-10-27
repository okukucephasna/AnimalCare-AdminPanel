import React, { useEffect, useState } from "react";
import { api } from "../api";

function DiseaseList() {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch diseases from backend
  const loadDiseases = async () => {
    try {
      const res = await api.get("/diseases");
      setDiseases(res.data.diseases || []);
    } catch (err) {
      console.error("Failed to load diseases:", err);
    } finally {
      setLoading(false);
    }
  };

  // Run once on load
  useEffect(() => {
    loadDiseases();
  }, []);

  // Handle new disease submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await api.post("/diseases", { name, symptoms });
      setName("");
      setSymptoms("");
      setMessage("✅ Disease added successfully!");
      loadDiseases(); // auto refresh list
    } catch (error) {
      console.error("Error saving disease:", error);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 2000); // auto-clear alert
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: "900px" }}>
      {/* Add Disease Form */}
      <div className="bg-white shadow-lg rounded-4 p-4 border border-light mx-auto" style={{ maxWidth: "700px" }}>
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
              disabled={saving}
            >
              {saving ? (
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

      {/* Diseases Table */}
      <div className="bg-white shadow-lg rounded-4 p-4 border border-light mt-4">
        <h4 className="text-center text-success fw-bold mb-3">
          <i className="bi bi-clipboard2-pulse me-2"></i>Diseases Database
        </h4>

        {loading ? (
          <p className="text-center text-muted">
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
            ></span>
            Loading diseases...
          </p>
        ) : diseases.length === 0 ? (
          <p className="text-center text-warning fw-bold">
            No diseases found. Add one above.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle text-center shadow-sm">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Disease Name</th>
                  <th>Symptoms</th>
                </tr>
              </thead>
              <tbody>
                {diseases.map((d, i) => (
                  <tr key={d.id}>
                    <td>{i + 1}</td>
                    <td className="fw-semibold text-primary">{d.name}</td>
                    <td className="text-muted">{d.symptoms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiseaseList;
