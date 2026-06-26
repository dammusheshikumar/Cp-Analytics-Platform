// src/pages/Dashboard.jsx

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { getDashboardSummary } from '../services/dashboardService';
import { formatNumber } from '../utils/formatters';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  if (loading) {
    return (
      <PageLayout>
        <LoadingSpinner label="Loading your dashboard..." />
      </PageLayout>
    );
  }

  const hasNoLinkedProfiles =
    summary && !summary.linkedProfiles.leetcodeUsername && !summary.linkedProfiles.codeforcesUsername;

  return (
    <PageLayout>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your coding contest performance at a glance</p>
      </div>

      <ErrorMessage message={error} onRetry={loadSummary} />

      {hasNoLinkedProfiles && (
        <div className="info-banner">
          You haven't linked any profiles yet.{' '}
          <Link to="/MyProfile">Link your LeetCode / Codeforces usernames</Link> to see your stats here.
        </div>
      )}

      {summary && (
        <>
          <div className="stat-grid">
            {summary.summary.leetcode && !summary.summary.leetcode.error && (
              <>
                <StatCard
                  label="LeetCode Problems Solved"
                  value={formatNumber(summary.summary.leetcode.totalSolved)}
                  accent="#f59e0b"
                  subtext={`Easy ${summary.summary.leetcode.easySolved} · Medium ${summary.summary.leetcode.mediumSolved} · Hard ${summary.summary.leetcode.hardSolved}`}
                />
                <StatCard
                  label="LeetCode Ranking"
                  value={formatNumber(summary.summary.leetcode.ranking)}
                  accent="#f59e0b"
                />
              </>
            )}

            {summary.summary.codeforces && !summary.summary.codeforces.error && (
              <>
                <StatCard
                  label="Codeforces Rating"
                  value={formatNumber(summary.summary.codeforces.rating)}
                  accent="#0ea5e9"
                  subtext={summary.summary.codeforces.rank}
                />
                <StatCard
                  label="Codeforces Max Rating"
                  value={formatNumber(summary.summary.codeforces.maxRating)}
                  accent="#0ea5e9"
                />
              </>
            )}
          </div>

          {summary.summary.leetcode?.error && (
            <ErrorMessage message={`LeetCode: ${summary.summary.leetcode.error}`} />
          )}
          {summary.summary.codeforces?.error && (
            <ErrorMessage message={`Codeforces: ${summary.summary.codeforces.error}`} />
          )}

          <div className="quick-links">
            <Link to="/leetcode" className="quick-link-card">
              <h3>📘 LeetCode Analysis</h3>
              <p>View detailed problem stats, acceptance rate, and submission heatmap</p>
            </Link>
            <Link to="/codeforces" className="quick-link-card">
              <h3>📗 Codeforces Analysis</h3>
              <p>View rating history, contest performance, and rank progression</p>
            </Link>
          </div>
        </>
      )}
    </PageLayout>
  );
}
