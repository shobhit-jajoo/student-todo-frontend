import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(() => localStorage.getItem('taskflow.sidebar') !== 'hidden');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarVisible((visible) => {
      const nextVisible = !visible;
      localStorage.setItem('taskflow.sidebar', nextVisible ? 'visible' : 'hidden');
      return nextVisible;
    });
  };

  return (
    <div className={`app-shell ${sidebarVisible ? '' : 'sidebar-collapsed'}`}>
      {sidebarVisible && <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">S</div>
          <div>
            <p className="eyebrow">Student</p>
            <h1>TaskFlow</h1>
          </div>
        </div>

        <nav className="nav">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Tasks
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Profile
          </NavLink>
        </nav>

        <div className="user-panel">
          <div>
            <strong>{user?.name ?? 'Student'}</strong>
            <small>{user?.email ?? 'student@example.com'}</small>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>}

      <main className="main-content">
        <button
          className="navbar-toggle"
          type="button"
          onClick={toggleSidebar}
          aria-label={sidebarVisible ? 'Hide navigation' : 'Show navigation'}
          title={sidebarVisible ? 'Hide navigation' : 'Show navigation'}
        >
          <span aria-hidden="true">{sidebarVisible ? '←' : '→'}</span>
          <span>{sidebarVisible ? 'Hide menu' : 'Show menu'}</span>
        </button>
        {children}
      </main>
    </div>
  );
}
