// src/components/charts/RatingLineChart.jsx
// Line chart showing rating progression over time.
// Used by both the LeetCode and Codeforces contest history pages,
// and the main dashboard's combined rating view.

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { formatDate } from '../../utils/formatters';

/**
 * @param {Array} data - array of { date: ISOString, rating: number }
 * @param {string} color - line color
 * @param {string} label - legend label, e.g. "Codeforces Rating"
 */
export default function RatingLineChart({ data, color = '#4f46e5', label = 'Rating' }) {
  if (!data || data.length === 0) {
    return <p className="empty-chart-message">No contest history available yet.</p>;
  }

  const chartData = data.map((point) => ({
    ...point,
    formattedDate: formatDate(point.date)
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="formattedDate" tick={{ fontSize: 12 }} minTickGap={20} />
        <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
        <Tooltip
          formatter={(value) => [value, label]}
          labelFormatter={(value) => `Date: ${value}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="rating"
          name={label}
          stroke={color}
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
