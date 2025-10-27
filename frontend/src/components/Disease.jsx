import React, { useEffect, useState } from "react";
import { api } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Disease() {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Edit modal states
  const [editModal, setEditModal] = useState({ show: false, id: null, name: "", symptoms: "" });

  // Delete modal states
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

  // Load diseases from backend
  const loadDiseases = async () => {
    try {
      const res = await api.get("/diseases");
      setDiseases(res.data.diseases || []);
    } catch (err) {
      console.error("Error loading diseases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiseases();
  }, []);

  // Handle form submission (Add)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !symptoms.trim()) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      await api.post("/diseases", { name, symptoms });
      setName("");
      setSymptoms("");
      setMessage("✅ Disease added successfully!");
      await loadDiseases();
    } catch (error) {
      console.error("Error saving disease:", error);
      setMessage("❌ Failed to add disease. Please try again.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Handle edit button click
  const handleEditClick = (disease) => {
    setEditModal({ show: true, id: disease.id, name: disease.name, symptoms: disease.symptoms });
  };

  // Handle delete button click
  const handleDeleteClick = (id) => {
    setDeleteModal({ show: true, id });
  };

  // Handle disease update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/diseases/${editModal.id}`, {
        name: editModal.name,
        symptoms: editModal.symptoms,
      });
      setMessage("✅ Disease updated successfully!");
      setEditModal({ show: false, id: null, name: "", symptoms: "" });
      await loadDiseases();
    } catch (error) {
      console.error("Error updating disease:", error);
      setMessage("❌ Failed to update disease.");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Handle disease deletion
  const handleDelete = async () => {
    try {
      await api.delete(`/diseases/${deleteModal.id}`);
      setMessage("🗑️ Disease deleted successfully!");
      setDeleteModal({ show: false, id: null });
      await loadDiseases();
    } catch (error) {
      console.error("Error deleting disease:", error);
      setMessage("❌ Failed to delete disease.");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div
      className="bg-white shadow-lg rounded-4 p-4 border border-light mx-auto"
      style={{ maxWidth: "800px" }}
    >
      <h4 className="text-center text-primary fw-bold mb-4">
        <i className="bi bi-heart-pulse me-2"></i>Add New Disease
      </h4>

      {/* Alert message */}
      {message && (
        <div
          className={`alert ${
            message.includes("✅")
              ? "alert-success"
              : message.includes("⚠️")
              ? "alert-warning"
              : message.includes("🗑️")
              ? "alert-info"
              : "alert-danger"
          } text-center fw-semibold py-2`}
        >
          {message}
        </div>
      )}

      {/* Add Disease Form */}
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
              "Save Disease"
            )}
          </button>
        </div>
      </form>

      {/* Table Section */}
      <div className="mt-5">
        <h4 className="text-center text-success fw-bold mb-3">
          <i className="bi bi-clipboard2-pulse me-2"></i>Diseases Database
        </h4>

        {loading ? (
          <p className="text-center text-muted">
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {diseases.map((d, i) => (
                  <tr key={d.id || i}>
                    <td>{i + 1}</td>
                    <td className="fw-semibold text-primary">{d.name}</td>
                    <td className="text-muted">{d.symptoms}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEditClick(d)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteClick(d.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModal.show && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-primary">
                  <i className="bi bi-pencil-square me-2"></i>Edit Disease
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditModal({ show: false })}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label className="form-label">Disease Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editModal.name}
                      onChange={(e) =>
                        setEditModal({ ...editModal, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Symptoms</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={editModal.symptoms}
                      onChange={(e) =>
                        setEditModal({ ...editModal, symptoms: e.target.value })
                      }
                      required
                    ></textarea>
                  </div>
                  <div className="text-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => setEditModal({ show: false })}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-danger">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  <i className="bi bi-exclamation-triangle me-2"></i>Confirm Delete
                </h5>
              </div>
              <div className="modal-body text-center">
                <p className="fw-semibold">
                  Are you sure you want to delete this disease?
                </p>
                <div className="mt-3">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={() => setDeleteModal({ show: false })}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-danger" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Disease;
