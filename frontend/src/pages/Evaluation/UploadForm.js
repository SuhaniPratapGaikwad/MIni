import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import EvaluationTable from './EvaluationTable';

const UploadForm = () => {
  const { yearType, academicYear, division } = useParams();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const fetchUploadedFiles = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/evaluation/files/${yearType}/${academicYear}/${division}`
      );
      setUploadedFiles(res.data); // Assuming the response is an array of filenames
    } catch (err) {
      console.error('Fetch error:', err);
      setUploadedFiles([]); // Handle error gracefully
    }
  };

  useEffect(() => {
    fetchUploadedFiles(); // Load on mount
  }, [yearType, academicYear, division]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an Excel file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/evaluation/upload/${yearType}/${academicYear}/${division}`,
        formData
      );
      setMessage(res.data.message || 'File uploaded successfully!');
      setError('');
      setShowTable(true);
      setFile(null);
      fetchUploadedFiles(); // Refresh list after successful upload
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-semibold text-blue-600 mb-4">
        Upload Excel - {yearType} {academicYear} {division}
      </h2>

      {/* Uploaded files section */}
      {uploadedFiles.length > 0 && (
        <div className="mb-4 border rounded p-3 bg-gray-50">
          <p className="text-sm font-semibold mb-2 text-gray-700">✅ Uploaded Entries:</p>
          <ul className="text-sm list-disc ml-5 text-gray-800">
            {uploadedFiles.map((file, index) => (
              <li key={index}>
                {file} {/* Displaying the filename returned from the backend */}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="block mb-4"
        />
        <button type="submit" className="btn w-full">Upload</button>
      </form>

      {message && <p className="text-green-600 mt-3">{message}</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}

      {showTable && (
        <EvaluationTable
          yearType={yearType}
          academicYear={academicYear}
          division={division}
        />
      )}
    </div>
  );
};

export default UploadForm;
