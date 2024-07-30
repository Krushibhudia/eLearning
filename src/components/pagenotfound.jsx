// NotFoundPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa'; // Example icon
import '../components/pagenotfound.css';
const NotFoundPage = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-1 text-danger">404</h1>
      <h2>Page Not Found</h2>
      <p className="lead">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <p className="lead">Please <Link to="/" className="text-primary">return to the homepage</Link>.</p>
      <div className="mt-4">
        <FaExclamationTriangle className="display-4 text-warning" />
      </div>
    </div>
  );
};

export default NotFoundPage;
