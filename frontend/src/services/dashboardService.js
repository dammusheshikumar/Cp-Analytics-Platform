// src/services/dashboardService.js
// API call for the combined dashboard summary endpoint.

import api from './api';

export async function getDashboardSummary() {
  const { data } = await api.get('/dashboard/summary');
  return data;
}
