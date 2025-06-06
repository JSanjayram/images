// AdminNav.js
import React from 'react';
import { Link } from 'react-router-dom';

const AdminNav = () => {
    return (
      <div className="admin-nav">
        <Link to="/admin" target="_blank" rel="noopener noreferrer" className="admin-link">
          <i className="fas fa-user-shield"></i> Admin
        </Link>
      </div>
    );
  };
export default AdminNav;