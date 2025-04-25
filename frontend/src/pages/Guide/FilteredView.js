import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/guide.css';

const FilteredView = () => {
  const { year } = useParams();
  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/guide/preference/view/${year}`);
      const preferences = res.data;

      // Group by domain
      const grouped = {};
      preferences.forEach((item) => {
        if (!grouped[item.domain]) {
          grouped[item.domain] = [];
        }
        grouped[item.domain].push({
          guideName: item.guideName,
          subDomain: item.subDomain,
        });
      });

      setGroupedData(grouped);
    };

    fetchData();
  }, [year]);

  const handleDownload = () => {
    window.open(`http://localhost:5000/api/guide/preference/download?year=${year}`, '_blank');
  };

  return (
    <div className="container mt-4">
      <h3>Preferences for {year}</h3>
      <button className="btn btn-success mb-4" onClick={handleDownload}>
        📥 Download as Word
      </button>

      {Object.keys(groupedData).length === 0 ? (
        <p>No preferences found.</p>
      ) : (
        Object.entries(groupedData).map(([domain, entries], index) => (
          <div key={index} className="mb-4">
            <h5 className="bg-light p-2 border rounded">{domain}</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Guide Name</th>
                  <th>Sub Domain</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => (
                  <tr key={i}>
                    <td>{entry.guideName}</td>
                    <td>{entry.subDomain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default FilteredView;
