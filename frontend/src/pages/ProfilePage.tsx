import { useAuth } from '../hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Account</p>
          <h2>Profile</h2>
        </div>
      </header>

      <div className="card profile-card">
        <div className="profile-avatar">{user?.name?.charAt(0)?.toUpperCase() ?? 'S'}</div>
        <div className="profile-info">
          <h3>{user?.name ?? 'Student'}</h3>
          <p>{user?.email ?? 'student@example.com'}</p>
          <small>Member since {user ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</small>
        </div>
      </div>
    </div>
  );
}
