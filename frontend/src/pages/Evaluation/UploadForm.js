import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UploadForm = () => {
  const { yearType, academicYear, division } = useParams();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileData, setFileData] = useState(null);
  const [selectedFilename, setSelectedFilename] = useState('');

  const fetchUploadedFiles = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/evaluation/files/${yearType}/${academicYear}/${division}`
      );
      setUploadedFiles(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setUploadedFiles([]);
    }
  }, [yearType, academicYear, division]);

  useEffect(() => {
    fetchUploadedFiles();
  }, [fetchUploadedFiles]);

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

    // Prevent duplicate upload
    if (uploadedFiles.includes(file.name)) {
      setError('This file has already been uploaded.');
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
      setFile(null);
      fetchUploadedFiles();
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
      setMessage('');
    }
  };

  const handleViewFile = async (filename) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/evaluation/file/${filename}`);
      setFileData(res.data.data);
      setSelectedFilename(filename);
    } catch (err) {
      console.error(err);
      setError('Error fetching file content.');
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axios.post(`http://localhost:5000/api/evaluation/file/update/${selectedFilename}`, {
        data: fileData,
      });
      setMessage('File saved successfully!');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error saving file.');
    }
  };

  const handleDeleteFile = async (filename) => {
    try {
      await axios.delete(`http://localhost:5000/api/evaluation/file/${filename}`);
      setMessage('File deleted successfully');
      setFileData(null);
      setSelectedFilename('');
      fetchUploadedFiles();
    } catch (err) {
      console.error(err);
      setError('Failed to delete file');
    }
  };

  const handleEditCell = (index, key, value) => {
    const updated = [...fileData];
    updated[index][key] = value;
    setFileData(updated);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-semibold text-blue-600 mb-4">
        Upload Excel - {yearType} {academicYear} {division}
      </h2>

      {/* Uploaded files section */}
      {uploadedFiles.length > 0 && (
        <div className="mb-4 border rounded p-3 bg-gray-50">
          <p className="text-sm font-semibold mb-2 text-gray-700">✅ Uploaded Files:</p>
          <ul className="text-sm list-disc ml-5 text-gray-800 space-y-1">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="flex justify-between items-center">
                <button
                  className="text-blue-600 font-medium underline"
                  onClick={() => handleViewFile(file)}
                >
                  {file}
                </button>
                <button
                  onClick={() => handleDeleteFile(file)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* File Upload Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="block mb-4"
        />
        <button type="submit" className="btn w-full bg-blue-500 text-white py-2 rounded">
          Upload
        </button>
      </form>

      {/* Message / Error display */}
      {message && <p className="text-green-600 mt-3">{message}</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}

      {/* Editable Table */}
      {fileData && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">📄 Editing: {selectedFilename}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {Object.keys(fileData[0] || {}).map((key, idx) => (
                    <th key={idx} className="border px-2 py-1">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fileData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.entries(row).map(([key, value], colIndex) => (
                      <td key={colIndex} className="border px-2 py-1">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleEditCell(rowIndex, key, e.target.value)}
                          className="w-full px-1"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={handleSaveChanges}
            className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
