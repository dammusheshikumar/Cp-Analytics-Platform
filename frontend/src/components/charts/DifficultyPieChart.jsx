// src/components/charts/DifficultyPieChart.jsx
// Pie chart showing Easy/Medium/Hard solved distribution.
// Used on the LeetCode profile page (feature #6: Problem Difficulty Distribution).

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDifficultyColor } from '../../utils/formatters';

/**
 * @param {Object} solved - { easy: number, medium: number, hard: number }
 */
export default function DifficultyPieChart({ solved }) {
  if (!solved || (solved.easy === 0 && solved.medium === 0 && solved.hard === 0)) {
    return <p className="empty-chart-message">No solved problems to display yet.</p>;
  }

  const data = [
    { name: 'Easy', value: solved.easy || 0 },
    { name: 'Medium', value: solved.medium || 0 },
    { name: 'Hard', value: solved.hard || 0 }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ name, value }) => `${name}: ${value}`}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={getDifficultyColor(entry.name)} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
