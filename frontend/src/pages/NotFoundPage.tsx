import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="auth-page">
      <div className="auth-card not-found">
        <h1>404</h1>
        <p>Page not found.</p>
        <Link to="/dashboard" className="primary-button inline-link">Return home</Link>
      </div>
    </div>
  );
}
