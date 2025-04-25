import React from 'react';
import '../styles/dashboard.css'; // We'll style this next
import bannerImage from '../assets/college.png'; // Your image file

function Dashboard() {
  return (
    <div className="dashboard-container text-center">
      <h1 className="dashboard-title">Academic Project Explorer CSE Department</h1>
      <img
        src={bannerImage}
        alt="Dashboard Banner"
        className="dashboard-image img-fluid"
      />
      
    </div>
  );
}

export default Dashboard;
