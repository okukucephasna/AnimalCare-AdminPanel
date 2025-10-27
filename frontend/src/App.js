import React, { useState } from "react";
import AddDiseaseForm from "./components/AddDiseaseForm";
import DiseaseList from "./components/DiseaseList";

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleAdded = () => setRefresh(!refresh);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">AnimalCare Admin Panel</h2>
      <AddDiseaseForm onAdded={handleAdded} />
      <DiseaseList key={refresh} />
    </div>
  );
}

export default App;
