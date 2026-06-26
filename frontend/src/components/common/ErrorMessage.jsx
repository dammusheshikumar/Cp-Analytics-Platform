// src/components/common/ErrorMessage.jsx
// Consistent error banner used across pages when a fetch fails.

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="error-message">
      <span>⚠️ {message}</span>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Retry
        </button>
      )}
    </div>
  );
}
