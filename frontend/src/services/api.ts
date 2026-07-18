import axios from 'axios';
import { DecisionResult } from '../types/index.js';

const api = axios.create({
  baseURL: '/api',
});

export const searchDecision = async (query: string): Promise<DecisionResult> => {
  const response = await api.post('/search-decision', { query });
  if (!response.data.success) {
    throw new Error(response.data.error || 'Search failed');
  }
  return response.data.data;
};
