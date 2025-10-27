import React, { useEffect, useState } from "react";
import { api } from "../api";

function DiseaseList() {
  const [diseases, setDiseases] = useState([]);

  const loadDiseases = async () => {
    const res = await api.get("/diseases");
    setDiseases(res.data.diseases);
  };

  useEffect(() => {
    loadDiseases();
  }, []);

  return (
    <div className="mt-4">
      <h4>All Diseases</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Disease Name</th>
            <th>Symptoms</th>
          </tr>
        </thead>
        <tbody>
          {diseases.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>{d.symptoms}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DiseaseList;
