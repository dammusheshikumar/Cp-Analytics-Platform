// src/pages/CodeforcesProfile.jsx

import { useState, useEffect, useCallback, useMemo } from 'react';
import PageLayout from '../components/layout/PageLayout';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import RatingLineChart from '../components/charts/RatingLineChart';
import {
  getCodeforcesProfile,
  getCodeforcesContests
} from '../services/codeforcesService';
import { getLinkedProfiles } from '../services/profileService';
import {
  formatDate,
  formatNumber,
  formatRatingChange,
  getCodeforcesRankColor
} from '../utils/formatters';

const SORT_OPTIONS = {
  DATE_DESC: 'Date (Newest first)',
  DATE_ASC: 'Date (Oldest first)',
  RATING_CHANGE_DESC: 'Rating Change (High to Low)',
  RATING_CHANGE_ASC: 'Rating Change (Low to High)'
};

export default function CodeforcesProfile() {
  const [handleInput, setHandleInput] = useState('');
  const [activeHandle, setActiveHandle] = useState('');

  const [profile, setProfile] = useState(null);
  const [contestHistory, setContestHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [sortBy, setSortBy] = useState('DATE_DESC');
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    getLinkedProfiles()
      .then((data) => {
        if (data.codeforcesUsername) {
          setHandleInput(data.codeforcesUsername);
          setActiveHandle(data.codeforcesUsername);
        }
      })
      .catch(() => {});
  }, []);

  const fetchAllData = useCallback(async (handle) => {
    if (!handle.trim()) return;
    setLoading(true);
    setError('');
    setProfile(null);

    try {
      const [profileData, contestsData] = await Promise.all([
        getCodeforcesProfile(handle),
        getCodeforcesContests(handle)
      ]);
      setProfile(profileData);
      setContestHistory(contestsData.history);
    } catch (err) {
      setError(err.response?.data?.message || `Could not find Codeforces user "${handle}"`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeHandle) {
      fetchAllData(activeHandle);
    }
  }, [activeHandle, fetchAllData]);

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveHandle(handleInput.trim());
  };

  // Array Mapping / Sorting / Filtering, as specified for the Contest History feature.
  // const displayedHistory = useMemo(() => {
  //   let rows = [...contestHistory];

  //   if (filterText.trim()) {
  //     const q = filterText.toLowerCase();
  //     rows = rows.filter((c) => c.contestName.toLowerCase().includes(q));
  //   }

  //   rows.sort((a, b) => {
  //     switch (sortBy) {
  //       case 'DATE_ASC':
  //         return new Date(a.date) - new Date(b.date);
  //       case 'RATING_CHANGE_DESC':
  //         return b.ratingChange - a.ratingChange;
  //       case 'RATING_CHANGE_ASC':
  //         return a.ratingChange - b.ratingChange;
  //       case 'DATE_DESC':
  //       default:
  //         return new Date(b.date) - new Date(a.date);
  //     }
  //   });

  //   return rows;
  // }, [contestHistory, sortBy, filterText]);

  // Rating graph wants chronological order regardless of table sort/filter.
  const ratingGraphData = useMemo(() => {
    return [...contestHistory]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((c) => ({ date: c.date, rating: c.newRating }));
  }, [contestHistory]);

  return (
    <PageLayout>
      <div className="page-header">
        <h1>Codeforces Profile Analysis</h1>
        <p>Enter a Codeforces handle to view rating history and contest performance</p>
      </div>

      <form className="username-search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter Codeforces handle..."
          value={handleInput}
          onChange={(e) => setHandleInput(e.target.value)}
        />
        <button type="submit" disabled={loading || !handleInput.trim()}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {error && <ErrorMessage message={error} onRetry={() => fetchAllData(activeHandle)} />}
      {loading && <LoadingSpinner label={`Fetching data for ${activeHandle}...`} />}

      {profile && !loading && (
        <>
          <div className="stat-grid">
            <StatCard
              label="Current Rating"
              value={formatNumber(profile.rating)}
              accent={getCodeforcesRankColor(profile.rank)}
              subtext={profile.rank}
            />
            <StatCard
              label="Max Rating"
              value={formatNumber(profile.maxRating)}
              accent={getCodeforcesRankColor(profile.maxRank)}
              subtext={profile.maxRank}
            />
            <StatCard label="Contribution" value={formatNumber(profile.contribution)} accent="#6366f1" />
            <StatCard label="Contests Played" value={formatNumber(contestHistory.length)} accent="#0ea5e9" />
          </div>

          <div className="chart-section">
            <h2>Rating Progress Over Time</h2>
            <RatingLineChart data={ratingGraphData} color="#0ea5e9" label="Codeforces Rating" />
          </div>

          <div className="table-section">
            <div className="table-controls">
              <h2>Contest History</h2>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Contest Name</th>
                  <th>Rank</th>
                  <th>Rating Change</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {contestHistory.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="empty-table-message">
                      No contests found.
                    </td>
                  </tr>
                ) : (
                  contestHistory.map((c, idx) => (
                    <tr key={idx}>
                      <td>{c.contestName}</td>
                      <td>#{formatNumber(c.rank)}</td>
                      <td
                        className={c.ratingChange >= 0 ? 'rating-change-positive' : 'rating-change-negative'}
                      >
                        {formatRatingChange(c.ratingChange)}
                      </td>
                      <td>{formatDate(c.date)}</td>
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
