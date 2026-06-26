// src/services/codeforcesService.js
// All API calls related to Codeforces profile analysis.

import api from './api';

export async function getCodeforcesProfile(handle) {
  const { data } = await api.get(`/codeforces/${encodeURIComponent(handle)}/profile`);
  return data;
}

export async function getCodeforcesContests(handle) {
  const { data } = await api.get(`/codeforces/${encodeURIComponent(handle)}/contests`);
  return data;
}

export async function getCodeforcesSubmissions(handle, limit = 50) {
  const { data } = await api.get(`/codeforces/${encodeURIComponent(handle)}/submissions`, {
    params: { limit }
  });
  return data;
}
