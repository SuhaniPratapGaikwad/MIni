import React, { useState } from 'react';
import api from '../../services/api';
import '../../styles/guide.css';

const AddPreference = () => {
  const [guideName, setGuideName] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [preferences, setPreferences] = useState([
    { domain: '', subDomain: '' },
    { domain: '', subDomain: '' },
    { domain: '', subDomain: '' },
    { domain: '', subDomain: '' }
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...preferences];
    updated[index][field] = value;
    setPreferences(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter out empty preferences (no domain or subDomain)
    const validPreferences = preferences.filter(
      (p) => p.domain.trim() !== '' && p.subDomain.trim() !== ''
    );

    if (validPreferences.length === 0) {
      return alert('Please fill at least one preference.');
    }

    const payload = validPreferences.map((p) => ({
      guideName,
      academicYear,
      domain: p.domain,
      subDomain: p.subDomain,
    }));

    await api.post('/guide/preference', payload);
    alert('Preferences submitted!');
  };

  const domainOptions = [
    "Artificial Intelligence, Machine Learning, Deep Learning",
    "Data Science",
    "IoT, Hardware",
    "Computer Network & Network Security",
    "Cyber Security and Blockchain",
    "AR/VR",
    "Web Tech, DevOps",
    "BI, Data Mining",
    "Image Processing",
    "Mobile App Development",
  ];

  return (
    <div className="container mt-4">
      <h3>Add Guide Preferences</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="guideName"
          placeholder="Guide Name"
          className="form-control mb-2"
          value={guideName}
          onChange={(e) => setGuideName(e.target.value)}
          required
        />

        <input
          type="text"
          name="academicYear"
          placeholder="Academic Year (e.g., 2023–2024)"
          className="form-control mb-3"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          required
        />

        {preferences.map((pref, index) => (
          <div key={index} className="mb-4 border p-3 rounded">
            <h5>Preference {index + 1}</h5>
            <select
              className="form-control mb-2"
              value={pref.domain}
              onChange={(e) => handleChange(index, 'domain', e.target.value)}
            >
              <option value="">Select Domain</option>
              {domainOptions.map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>

            <input
              type="text"
              className="form-control"
              placeholder="Sub Domain"
              value={pref.subDomain}
              onChange={(e) => handleChange(index, 'subDomain', e.target.value)}
            />
          </div>
        ))}

        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default AddPreference;
