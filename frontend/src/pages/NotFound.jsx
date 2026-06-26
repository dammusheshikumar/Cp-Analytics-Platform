// src/pages/NotFound.jsx

import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>Page not found, Try Again!!</p>
      <Link to="/dashboard">Go to Dashboard</Link>
    </div>
  );
}
