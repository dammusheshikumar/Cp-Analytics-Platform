// src/utils/formatters.js
// Small shared formatting helpers so components don't repeat logic.

export function formatDate(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatNumber(num) {
  if (num === null || num === undefined) return '—';
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatRatingChange(change) {
  if (change === null || change === undefined) return '—';
  const sign = change > 0 ? '+' : '';
  return `${sign}${change}`;
}

// Codeforces rank -> color, matching the platform's own color conventions.
export function getCodeforcesRankColor(rank) {
  if (!rank) return '#808080';
  const normalized = rank.toLowerCase();
  if (normalized.includes('legendary grandmaster')) return '#ff0000';
  if (normalized.includes('international grandmaster')) return '#ff0000';
  if (normalized.includes('grandmaster')) return '#ff0000';
  if (normalized.includes('international master')) return '#ff8c00';
  if (normalized.includes('master')) return '#ff8c00';
  if (normalized.includes('candidate master')) return '#aa00aa';
  if (normalized.includes('expert')) return '#0000ff';
  if (normalized.includes('specialist')) return '#03a89e';
  if (normalized.includes('pupil')) return '#008000';
  if (normalized.includes('newbie')) return '#808080';
  return '#808080';
}

export function getDifficultyColor(difficulty) {
  const normalized = (difficulty || '').toLowerCase();
  if (normalized === 'easy') return '#22c55e';
  if (normalized === 'medium') return '#f59e0b';
  if (normalized === 'hard') return '#ef4444';
  return '#6b7280';
}
