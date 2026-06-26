// src/pages/MyProfile.jsx

import { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { getLinkedProfiles, updateLinkedProfiles } from '../services/profileService';

export default function MyProfile() {
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [codeforcesUsername, setCodeforcesUsername] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    getLinkedProfiles()
      .then((data) => {
        setLeetcodeUsername(data.leetcodeUsername || '');
        setCodeforcesUsername(data.codeforcesUsername || '');
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load saved profiles'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');
    try {
      await updateLinkedProfiles({ leetcodeUsername, codeforcesUsername });
      setSuccessMessage('Profile links saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile links');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <LoadingSpinner label="Loading Profile..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Link your Coding Profiles to Enhance your Dashboard</p>
      </div>

      <form className="MyProfile-form" onSubmit={handleSave}>
        {error && <ErrorMessage message={error} />}
        {successMessage && <div className="success-message">✅ {successMessage}</div>}

        <label htmlFor="leetcode">LeetCode Username</label>
        <input
          id="leetcode"
          type="text"
          placeholder="Ex. dammu_sheshikumar"
          value={leetcodeUsername}
          onChange={(e) => setLeetcodeUsername(e.target.value)}
        />

        <label htmlFor="codeforces">Codeforces Handle</label>
        <input
          id="codeforces"
          type="text"
          placeholder="Ex. dammu_sheshikumar"
          value={codeforcesUsername}
          onChange={(e) => setCodeforcesUsername(e.target.value)}
        />

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </PageLayout>
  );
}
