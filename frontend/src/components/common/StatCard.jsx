// src/components/common/StatCard.jsx
// Small metric display card used throughout dashboard / profile pages.
// e.g. <StatCard label="Current Rating" value={1847} accent="#4f46e5" />

export default function StatCard({ label, value, accent = '#4f46e5', subtext }) {
  return (
    <div className="stat-card" style={{ borderTopColor: accent }}>
      <p className="stat-card-label">{label}</p>
      <p className="stat-card-value" style={{ color: accent }}>
        {value}
      </p>
      {subtext && <p className="stat-card-subtext">{subtext}</p>}
    </div>
  );
}
