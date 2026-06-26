// utils/leetcodeApi.js
// Thin client around LeetCode's public GraphQL endpoint.
// LeetCode does not offer an official REST API for public profile stats,
// but the same GraphQL endpoint their own website uses is open and
// requires no authentication for public data. We query it directly.

const axios = require('axios');

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

const client = axios.create({
  baseURL: LEETCODE_GRAPHQL_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // LeetCode's GraphQL endpoint expects a referer matching a profile page,
    // otherwise some deployments reject the request.
    Referer: 'https://leetcode.com'
  }
});

/**
 * Fetches solved-count breakdown (Easy/Medium/Hard), acceptance rate,
 * ranking, and basic profile info for a given username.
 */
async function getLeetCodeProfile(username) {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          ranking
          reputation
          starRating
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
          totalSubmissionNum {
            difficulty
            count
          }
        }
      }
      allQuestionsCount {
        difficulty
        count
      }
    }
  `;

  const { data } = await client.post('', {
    query,
    variables: { username }
  });

  if (data.errors) {
    throw new Error(data.errors[0].message || 'LeetCode GraphQL error');
  }

  if (!data.data || !data.data.matchedUser) {
    const err = new Error(`LeetCode user "${username}" not found`);
    err.statusCode = 404;
    throw err;
  }

  return data.data;
}

/**
 * Fetches recent accepted/attempted submissions for a user (last ~20).
 * Uses LeetCode's recentSubmissionList query.
 */
async function getRecentSubmissions(username, limit = 20) {
  const query = `
    query recentSubmissions($username: String!, $limit: Int) {
      recentSubmissionList(username: $username, limit: $limit) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
      }
    }
  `;

  const { data } = await client.post('', {
    query,
    variables: { username, limit }
  });

  if (data.errors) {
    throw new Error(data.errors[0].message || 'LeetCode GraphQL error');
  }

  return data.data?.recentSubmissionList || [];
}

/**
 * Fetches the user's contest rating history (for the rating graph).
 */
async function getContestHistory(username) {
  const query = `
    query userContestRankingInfo($username: String!) {
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        totalParticipants
        topPercentage
      }
      userContestRankingHistory(username: $username) {
        attended
        rating
        ranking
        contest {
          title
          startTime
        }
      }
    }
  `;

  const { data } = await client.post('', {
    query,
    variables: { username }
  });

  if (data.errors) {
    throw new Error(data.errors[0].message || 'LeetCode GraphQL error');
  }

  return {
    summary: data.data?.userContestRanking || null,
    history: (data.data?.userContestRankingHistory || []).filter(c => c.attended)
  };
}

/**
 * Fetches the submission calendar (heatmap data: date -> submission count).
 */
async function getSubmissionCalendar(username) {
  const query = `
    query userProfileCalendar($username: String!) {
      matchedUser(username: $username) {
        userCalendar {
          submissionCalendar
        }
      }
    }
  `;

  const { data } = await client.post('', {
    query,
    variables: { username }
  });

  if (data.errors) {
    throw new Error(data.errors[0].message || 'LeetCode GraphQL error');
  }

  const raw = data.data?.matchedUser?.userCalendar?.submissionCalendar;
  if (!raw) return {};

  // submissionCalendar comes back as a JSON string: { "<unixTimestamp>": count }
  return JSON.parse(raw);
}

module.exports = {
  getLeetCodeProfile,
  getRecentSubmissions,
  getContestHistory,
  getSubmissionCalendar
};
