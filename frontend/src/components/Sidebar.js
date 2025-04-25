import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/sidebar.css';



function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
        <h4 className="text-white text-center py-3">Academic Project Explorer</h4>
        <ul className="nav flex-column px-3">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/guide" className="nav-link">Guide</Link>
          </li>
          <li className="nav-item">
            <Link to="/evaluation" className="nav-link">Evaluation</Link>
          </li>
          <li className="nav-item">
            <Link to="/notices" className="nav-link">Notices & Circulars</Link>
          </li>
          <li className="nav-item">
            <Link to="/projects" className="nav-link">Project List</Link>
          </li>
          <li className="nav-item">
            <Link to="/student" className="nav-link">Student</Link>
          </li>

        </ul>
      </div>

      <button className="toggle-btn btn btn-sm btn-light" onClick={toggleSidebar}>
      <i className="fas fa-bars"></i>
      </button>

 </>
  );
}

export default Sidebar;
