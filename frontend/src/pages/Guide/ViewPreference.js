import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import '../../styles/guide.css';

const ViewPreference = () => {
  const [year, setYear] = useState('');
  const navigate = useNavigate();

  const handleGo = () => {
    if (year) {
      navigate(`/guide/preference/view/${year}`);
    }
  };

  return (
    <div className="container mt-4">
      <h3>View Guide Preferences</h3>
      <div className="input-group mb-3 mt-4">
        <input type="text" className="form-control" placeholder="Enter Academic Year (e.g. 2023-2024)" value={year} onChange={(e) => setYear(e.target.value)} />
        <button className="btn btn-primary" onClick={handleGo}>Go</button>
      </div>
    </div>
  );
};

export default ViewPreference;
