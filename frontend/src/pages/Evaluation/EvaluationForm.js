import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EvaluationForm = ({ yearType, academicYear, division }) => {
  const [evaluations, setEvaluations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/evaluation', {
          params: { yearType, academicYear, division },
        });
        setEvaluations(res.data.length > 0 ? res.data[0].data : []);
      } catch (err) {
        console.error('Error fetching evaluation data:', err);
      }
    };

    fetchData();
  }, [yearType, academicYear, division]);

  const filtered = evaluations.filter((item) => {
    const search = searchQuery.toLowerCase();
    return (
      item.Group?.toLowerCase().includes(search) ||
      item.Guide?.toLowerCase().includes(search) ||
      item['Student Name']?.toLowerCase().includes(search)
    );
  });

  const rubricHeaders =
    yearType === 'FY'
      ? ['Comment', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6']
      : ['Comment', 'R1', 'R2', 'R3'];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-blue-600">Evaluation Table - {division}</h2>

      <input
        type="text"
        placeholder="Search by Group, Guide or Student"
        className="mb-4 px-3 py-2 border rounded w-full md:w-1/2 shadow-sm"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Group</th>
              <th className="p-2 border">Guide</th>
              <th className="p-2 border">Student Name</th>
              {rubricHeaders.map((header) => (
                <th key={header} className="p-2 border">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50">
                  <td className="p-2 border">{row.Group}</td>
                  <td className="p-2 border">{row.Guide}</td>
                  <td className="p-2 border">{row['Student Name']}</td>
                  {rubricHeaders.map((col) => (
                    <td key={col} className="p-2 border">{row[col]}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-2 border text-center" colSpan={3 + rubricHeaders.length}>
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EvaluationForm;
