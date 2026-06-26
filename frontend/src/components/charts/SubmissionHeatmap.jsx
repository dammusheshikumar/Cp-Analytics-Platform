// src/components/charts/SubmissionHeatmap.jsx
// GitHub-style calendar heatmap showing daily submission activity.
// Used on the LeetCode profile page (feature #3: problem-solving heatmap).
// Built with plain divs/CSS grid rather than a chart library since
// Recharts has no calendar-heatmap chart type.

import { useMemo } from 'react';

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKS_TO_SHOW = 26; // ~6 months

function getColorForCount(count) {
  if (count === 0) return '#ebedf0';
  if (count === 1) return '#c6e48b';
  if (count <= 3) return '#7bc96f';
  if (count <= 6) return '#239a3b';
  return '#196127';
}

/**
 * @param {Object} heatmap - { "YYYY-MM-DD": count }
 */
export default function SubmissionHeatmap({ heatmap }) {
  const { weeks, totalSubmissions } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalDays = WEEKS_TO_SHOW * 7;
    const startDate = new Date(today.getTime() - (totalDays - 1) * DAY_MS);

    // Align start date back to the most recent Sunday so columns line up as weeks.
    const startDay = startDate.getDay();
    startDate.setTime(startDate.getTime() - startDay * DAY_MS);

    const days = [];
    let total = 0;
    for (let i = 0; i < totalDays + startDay; i++) {
      const date = new Date(startDate.getTime() + i * DAY_MS);
      const key = date.toISOString().split('T')[0];
      const count = heatmap?.[key] || 0;
      total += count;
      days.push({ date: key, count });
    }

    // Chunk into weeks (columns of 7 days each)
    const weekChunks = [];
    for (let i = 0; i < days.length; i += 7) {
      weekChunks.push(days.slice(i, i + 7));
    }

    return { weeks: weekChunks, totalSubmissions: total };
  }, [heatmap]);

  return (
    <div className="heatmap-container">
      <p className="heatmap-summary">{totalSubmissions} submissions in the last 6 months</p>
      <div className="heatmap-grid">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="heatmap-week">
            {week.map((day) => (
              <div
                key={day.date}
                className="heatmap-cell"
                style={{ backgroundColor: getColorForCount(day.count) }}
                title={`${day.date}: ${day.count} submission${day.count === 1 ? '' : 's'}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="heatmap-legend">
        <span>Less</span>
        {[0, 1, 3, 6, 7].map((c) => (
          <div key={c} className="heatmap-cell" style={{ backgroundColor: getColorForCount(c) }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
