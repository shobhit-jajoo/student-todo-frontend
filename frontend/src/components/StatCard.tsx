interface StatCardProps {
  label: string;
  value: number;
  icon?: string;
  accent?: 'default' | 'pending' | 'success' | 'danger' | 'warning';
  subtext?: string;
}

export default function StatCard({ label, value, icon, accent = 'default', subtext }: StatCardProps) {
  return (
    <div className={`stat-card stat-accent-${accent}`}>
      <div className="stat-card-header">
        <span className="stat-label">{label}</span>
        {icon && <span className="stat-icon" aria-hidden="true">{icon}</span>}
      </div>
      <strong className="stat-value">{value}</strong>
      {subtext && <small className="stat-subtext">{subtext}</small>}
    </div>
  );
}
