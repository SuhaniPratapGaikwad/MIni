// src/pages/Evaluation/AcademicYearSelection.js
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

function AcademicYearSelection() {
  const navigate = useNavigate();
  const { yearType } = useParams();
  const [year, setYear] = useState('');

  const handleNavigate = () => {
    if (year.trim()) {
      navigate(`/evaluation/${yearType}/${year.trim()}`);
    }
  };

  return (
    <div className="p-6">
      {!yearType ? (
        <>
          <h2 className="text-xl font-bold mb-4">Select Evaluation Type</h2>
          <div className="space-x-4">
            <button onClick={() => navigate('/evaluation/FY')} className="btn">FY</button>
            <button onClick={() => navigate('/evaluation/TY')} className="btn">TY</button>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold mb-2">{yearType} Evaluation</h3>
          <input
            type="text"
            placeholder="Enter Academic Year (e.g. 2024-25)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border px-2 py-1 mr-4"
          />
          <button onClick={handleNavigate} className="btn">Add New</button>
        </>
      )}
    </div>
  );
}

export default AcademicYearSelection;
