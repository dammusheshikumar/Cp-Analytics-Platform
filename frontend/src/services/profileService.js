// src/services/profileService.js
// API calls for saving/reading the user's linked LeetCode/Codeforces usernames.

import api from './api';

export async function getLinkedProfiles() {
  const { data } = await api.get('/profile/links');
  return data;
}

export async function updateLinkedProfiles({ leetcodeUsername, codeforcesUsername }) {
  const { data } = await api.put('/profile/links', { leetcodeUsername, codeforcesUsername });
  return data;
}
