// utils/codeforcesApi.js
// Thin client around Codeforces' official public REST API.
// Docs: https://codeforces.com/apiHelp
// No API key needed for the read-only endpoints we use here.

const axios = require('axios');

const CF_BASE_URL = 'https://codeforces.com/api';

const client = axios.create({
  baseURL: CF_BASE_URL,
  timeout: 10000
});

/**
 * Basic profile info: current rating, max rating, rank, etc.
 */
async function getUserInfo(handle) {
  try {
    const { data } = await client.get('/user.info', {
      params: { handles: handle }
    });
    if (data.status !== 'OK') {
      throw new Error(data.comment || 'Codeforces API error');
    }
    return data.result[0];
  } catch (err) {
    if (err.response?.data?.comment?.includes('not found')) {
      const notFoundErr = new Error(`Codeforces user "${handle}" not found`);
      notFoundErr.statusCode = 404;
      throw notFoundErr;
    }
    throw err;
  }
}

/**
 * Full rating history across all rated contests the user has participated in.
 * This powers both the rating graph and the contest history table.
 */
async function getRatingHistory(handle) {
  try {
    const { data } = await client.get('/user.rating', {
      params: { handle }
    });
    if (data.status !== 'OK') {
      throw new Error(data.comment || 'Codeforces API error');
    }
    return data.result; // array of { contestId, contestName, rank, ratingUpdateTimeSeconds, oldRating, newRating }
  } catch (err) {
    if (err.response?.data?.comment?.includes('not found')) {
      const notFoundErr = new Error(`Codeforces user "${handle}" not found`);
      notFoundErr.statusCode = 404;
      throw notFoundErr;
    }
    throw err;
  }
}

/**
 * Recent submissions for a user (used for activity feed / solved-count stats).
 * count = how many of the most recent submissions to fetch.
 */
async function getUserSubmissions(handle, count = 50) {
  const { data } = await client.get('/user.status', {
    params: { handle, from: 1, count }
  });
  if (data.status !== 'OK') {
    throw new Error(data.comment || 'Codeforces API error');
  }
  return data.result;
}

module.exports = { getUserInfo, getRatingHistory, getUserSubmissions };
