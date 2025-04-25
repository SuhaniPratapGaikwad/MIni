import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/guide.css';

const GuidePreference = () => {
  return (
    <div className="container mt-5">
      <h2>Guide Preference</h2>
      <div className="d-flex gap-3 mt-4">
        <Link to="/guide/preference/add" className="btn btn-success">➕ Add Preference</Link>
        <Link to="/guide/preference/view" className="btn btn-outline-primary">📄 View Preference</Link>
      </div>
    </div>
  );
};

export default GuidePreference;
