// src/components/common/LoadingSpinner.jsx


export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner" />
      <p>{label}</p>
    </div>
  );
}
