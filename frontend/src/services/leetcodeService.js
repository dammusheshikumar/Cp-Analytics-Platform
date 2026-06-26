// src/services/leetcodeService.js
// All API calls related to LeetCode profile analysis.

import api from './api';

export async function getLeetCodeProfile(username) {
  const { data } = await api.get(`/leetcode/${encodeURIComponent(username)}/profile`);
  return data;
}

export async function getLeetCodeSubmissions(username, limit = 20) {
  const { data } = await api.get(`/leetcode/${encodeURIComponent(username)}/submissions`, {
    params: { limit }
  });
  return data;
}

export async function getLeetCodeContests(username) {
  const { data } = await api.get(`/leetcode/${encodeURIComponent(username)}/contests`);
  return data;
}

export async function getLeetCodeHeatmap(username) {
  const { data } = await api.get(`/leetcode/${encodeURIComponent(username)}/heatmap`);
  return data;
}
