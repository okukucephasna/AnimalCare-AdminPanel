import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Disease from "./components/Disease";

function App() {
  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <h2 className="text-center mb-4 text-primary fw-bold">
          <i className="bi bi-heart-pulse me-2"></i>AnimalCare Admin Dashboard
        </h2>

        {/* Disease management section */}
        <Disease />
      </div>
    </div>
  );
}

export default App;
