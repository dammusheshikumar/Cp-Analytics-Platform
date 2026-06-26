// src/pages/LeetCodeProfile.jsx


import { useState, useEffect, useCallback } from 'react';
import PageLayout from '../components/layout/PageLayout';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import DifficultyPieChart from '../components/charts/DifficultyPieChart';
import RatingLineChart from '../components/charts/RatingLineChart';
import SubmissionHeatmap from '../components/charts/SubmissionHeatmap';
import {
  getLeetCodeProfile,
  getLeetCodeContests,
  getLeetCodeHeatmap,
  getLeetCodeSubmissions
} from '../services/leetcodeService';
import { getLinkedProfiles } from '../services/profileService';
import { formatDate, formatNumber } from '../utils/formatters';

export default function LeetCodeProfile() {
  const [usernameInput, setUsernameInput] = useState('');
  const [activeUsername, setActiveUsername] = useState('');

  const [profile, setProfile] = useState(null);
  const [contests, setContests] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-filled with the user's saved LeetCode username
  useEffect(() => {
    getLinkedProfiles()
      .then((data) => {
        if (data.leetcodeUsername) {
          setUsernameInput(data.leetcodeUsername);
          setActiveUsername(data.leetcodeUsername);
        }
      })
      .catch(() => {});
  }, []);

  const fetchAllData = useCallback(async (username) => {
    if (!username.trim()) return;
    setLoading(true);
    setError('');
    setProfile(null);

    try {
      const [profileData, contestData, heatmapData, submissionData] = await Promise.all([
        getLeetCodeProfile(username),
        getLeetCodeContests(username).catch(() => ({ summary: null, history: [] })),
        getLeetCodeHeatmap(username).catch(() => ({ heatmap: {} })),
        getLeetCodeSubmissions(username, 15).catch(() => ({ submissions: [] }))
      ]);

      setProfile(profileData);
      setContests(contestData);
      setHeatmap(heatmapData.heatmap);
      setSubmissions(submissionData.submissions);
    } catch (err) {
      setError(err.response?.data?.message || `Could not find LeetCode user "${username}"`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeUsername) {
      fetchAllData(activeUsername);
    }
  }, [activeUsername, fetchAllData]);

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveUsername(usernameInput.trim());
  };

  return (
    <PageLayout>
      <div className="page-header">
        <h1>LeetCode Profile Analysis</h1>
        <p>Enter a LeetCode username to view detailed stats</p>
      </div>

      <form className="username-search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter LeetCode username..."
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
        />
        <button type="submit" disabled={loading || !usernameInput.trim()}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {error && <ErrorMessage message={error} onRetry={() => fetchAllData(activeUsername)} />}
      {loading && <LoadingSpinner label={`Fetching data for ${activeUsername}...`} />}

      {profile && !loading && (
        <>
          <div className="stat-grid">
            <StatCard label="Total Solved" value={formatNumber(profile.solved.total)} accent="#22c55e" />
            <StatCard label="Easy Solved" value={formatNumber(profile.solved.easy)} accent="#22c55e" />
            <StatCard label="Medium Solved" value={formatNumber(profile.solved.medium)} accent="#f59e0b" />
            <StatCard label="Hard Solved" value={formatNumber(profile.solved.hard)} accent="#ef4444" />
            <StatCard label="Acceptance Rate" value={`${profile.acceptanceRate}%`} accent="#0ea5e9" />
            <StatCard label="Global Ranking" value={formatNumber(profile.ranking)} accent="#6366f1" />
          </div>

          <div className="chart-section">
            <h2>Problem Difficulty Distribution</h2>
            <DifficultyPieChart solved={profile.solved} />
          </div>

          {contests?.summary && (
            <div className="chart-section">
              <h2>Contest Rating Progress</h2>
              <p className="chart-subtitle">
                Attended {contests.summary.attendedContests} contests · Top{' '}
                {contests.summary.topPercentage?.toFixed(1)}%
              </p>
              <RatingLineChart data={contests.history} color="#f59e0b" label="LeetCode Rating" />
            </div>
          )}

          <div className="chart-section">
            <h2>Problem-Solving Heatmap</h2>
            <SubmissionHeatmap heatmap={heatmap} />
          </div>

          <div className="table-section">
            <h2>Recent Submissions</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Problem</th>
                  <th>Verdict</th>
                  <th>Language</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="empty-table-message">
                      No recent submissions found.
                    </td>
                  </tr>
                ) : (
                  submissions.map((s, idx) => (
                    <tr key={idx}>
                      <td>{s.title}</td>
                      <td>
                        <span
                          className={`verdict-badge ${
                            s.verdict === 'Accepted' ? 'verdict-accepted' : 'verdict-failed'
                          }`}
                        >
                          {s.verdict}
                        </span>
                      </td>
                      <td>{s.language === "cpp" ? "c++" : s.language}</td>
                      <td>{formatDate(s.submittedAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </PageLayout>
  );
}
