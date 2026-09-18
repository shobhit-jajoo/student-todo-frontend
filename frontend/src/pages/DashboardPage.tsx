import { useEffect, useState } from 'react';
import api from '../services/api';
import type { DashboardStats } from '../types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await api.get('/tasks/stats');
        setStats(response.data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    void loadStats();
  }, []);

  if (loading) return <div className="page-loading">Loading dashboard...</div>;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Dashboard</h2>
        </div>
      </header>

      {error && <div className="message error">{error}</div>}

      {stats && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span>Total Tasks</span>
              <strong>{stats.total}</strong>
            </div>
            <div className="stat-card">
              <span>Pending</span>
              <strong>{stats.pending}</strong>
            </div>
            <div className="stat-card">
              <span>Completed</span>
              <strong>{stats.completed}</strong>
            </div>
            <div className="stat-card">
              <span>High Priority</span>
              <strong>{stats.highPriority}</strong>
            </div>
            <div className="stat-card">
              <span>Due Today</span>
              <strong>{stats.dueToday}</strong>
            </div>
          </div>

          <div className="progress-card">
            <div className="progress-header">
              <h3>Overall Progress</h3>
              <span>
                {stats.completed} / {stats.total} tasks completed
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${stats.total === 0 ? 0 : (stats.completed / stats.total) * 100}%` }}
              />
            </div>
            <p>{stats.total === 0 ? '0% completion' : `${Math.round((stats.completed / stats.total) * 100)}% completion`}</p>
          </div>
        </>
      )}
    </div>
  );
}
