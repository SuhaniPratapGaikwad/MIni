import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Notices() {
  const [file, setFile] = useState(null);
  const [year, setYear] = useState('');
  const [notices, setNotices] = useState([]);
  const [message, setMessage] = useState('');
  const [searchYear, setSearchYear] = useState('');

  // Fetch notices when the component is mounted or after an update
  const fetchNotices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notices');
      setNotices(res.data);
    } catch (err) {
      console.error('Error fetching notices', err);
    }
  };

  useEffect(() => {
    fetchNotices(); // Initial fetch when the component is mounted
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !year) {
      setMessage("Year and file are required!");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('year', year);

    try {
      const res = await axios.post('http://localhost:5000/api/notices/upload', formData);

      // Re-fetch the notices after upload
      fetchNotices();

      setMessage('Uploaded successfully!');
      setYear('');
      setFile(null);
    } catch (err) {
      setMessage('Error uploading file');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notices/${id}`);

      // Re-fetch the notices after delete
      fetchNotices();

      setMessage('Notice deleted successfully');
    } catch (err) {
      setMessage('Error deleting notice');
    }
  };

  const filteredNotices = notices.filter(notice =>
    notice.year.toLowerCase().includes(searchYear.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Notices & Circulars</h3>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={year}
          placeholder="Enter Year"
          onChange={(e) => setYear(e.target.value)}
          style={{ padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept=".pdf"
          style={{ fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '10px', fontSize: '16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Upload Notice
        </button>
      </form>

      {message && (
        <p style={{ color: message.includes('Error') ? 'red' : 'green', marginBottom: '20px' }}>{message}</p>
      )}

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by year"
          value={searchYear}
          onChange={(e) => setSearchYear(e.target.value)}
          style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      <h4 style={{ marginBottom: '10px' }}>Uploaded Notices</h4>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {filteredNotices.length > 0 ? (
          filteredNotices.map(notice => (
            <li key={notice._id} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                <strong>{notice.year}:</strong>{' '}
                <a href={`http://localhost:5000${notice.fileUrl}`} target="_blank" rel="noreferrer">
                  View Notice
                </a>
              </span>
              <button
                onClick={() => handleDelete(notice._id)}
                style={{ marginLeft: '10px', padding: '6px 10px', backgroundColor: 'crimson', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No notices found for "{searchYear}"</p>
        )}
      </ul>
    </div>
  );
}

export default Notices;
