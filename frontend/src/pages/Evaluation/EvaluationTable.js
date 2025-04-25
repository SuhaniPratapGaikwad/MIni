import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EvaluationTable = ({ fileId }) => {
  const [rows, setRows] = useState([]);
  const [filename, setFilename] = useState('');

  useEffect(() => {
    if (fileId) {
      fetchEvaluationData();
    }
  }, [fileId]);

  const fetchEvaluationData = async () => {
    try {
      const res = await axios.get(`/api/evaluate/file/${fileId}`);
      setRows(res.data.rows || []);
      setFilename(res.data.filename || '');
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...rows];
    updated[index] = {
      ...updated[index],
      [field]: value || '', // Avoid undefined
    };
    setRows(updated);
  };

  const handleSave = async (index) => {
    try {
      await axios.put(`/api/evaluate/file/${fileId}/row/${index}`, rows[index]);
      alert('Saved!');
    } catch (err) {
      console.error(err);
      alert('Failed to save');
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Delete this row?")) return;
    try {
      await axios.delete(`/api/evaluate/file/${fileId}/row/${index}`);
      fetchEvaluationData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  return (
    <div>
      <h3>Evaluation File: {filename}</h3>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Group</th>
            <th>Guide</th>
            <th>Student Name</th>
            <th>Comment</th>
            <th>R1</th>
            <th>R2</th>
            <th>R3</th>
            {rows.some(r => r.R4 !== undefined) && <th>R4</th>}
            {rows.some(r => r.R5 !== undefined) && <th>R5</th>}
            {rows.some(r => r.R6 !== undefined) && <th>R6</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row.group}</td>
              <td>{row.guide}</td>
              <td>{row.studentName}</td>
              <td><input value={row.comment || ''} onChange={e => handleInputChange(index, 'comment', e.target.value)} /></td>
              <td><input value={row.R1 || ''} onChange={e => handleInputChange(index, 'R1', e.target.value)} /></td>
              <td><input value={row.R2 || ''} onChange={e => handleInputChange(index, 'R2', e.target.value)} /></td>
              <td><input value={row.R3 || ''} onChange={e => handleInputChange(index, 'R3', e.target.value)} /></td>
              {row.R4 !== undefined && <td><input value={row.R4 || ''} onChange={e => handleInputChange(index, 'R4', e.target.value)} /></td>}
              {row.R5 !== undefined && <td><input value={row.R5 || ''} onChange={e => handleInputChange(index, 'R5', e.target.value)} /></td>}
              {row.R6 !== undefined && <td><input value={row.R6 || ''} onChange={e => handleInputChange(index, 'R6', e.target.value)} /></td>}
              <td>
                <button onClick={() => handleSave(index)}>Save</button>
                <button onClick={() => handleDelete(index)} style={{ marginLeft: '5px', color: 'red' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EvaluationTable;
