import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/guide.css';

const GuideMain = () => {
  return (
    <div className="container mt-5 text-center">
      <h2 className="mb-4">Guide Section</h2>
      <Link to="/guide/preference" className="btn btn-primary btn-lg">
        📘 Guide Preference
      </Link>
    </div>
  );
};

export default GuideMain;

