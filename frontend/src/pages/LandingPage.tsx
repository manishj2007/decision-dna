import React, { useState } from 'react';
import { searchDecision } from '../services/api.js';
import { DecisionResult } from '../types/index.js';
import ResultsPage from './ResultsPage.js';

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const data = await searchDecision(query);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return <ResultsPage result={result} onBack={() => setResult(null)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            DecisionDNA
          </h1>
          <p className="text-xl text-slate-400">Ask why any business decision was made</p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Why was Feature X cancelled? What caused the database migration?"
              className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-slate-500 transition"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition transform hover:scale-105 disabled:hover:scale-100"
          >
            {loading ? 'Searching...' : 'Search Decision'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <h3 className="font-semibold text-blue-400 mb-2">Search</h3>
            <p className="text-sm text-slate-400">Ask natural language questions about decisions</p>
          </div>
          <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <h3 className="font-semibold text-cyan-400 mb-2">Reconstruct</h3>
            <p className="text-sm text-slate-400">AI gathers evidence from multiple sources</p>
          </div>
          <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <h3 className="font-semibold text-purple-400 mb-2">Explore</h3>
            <p className="text-sm text-slate-400">View timeline, outcomes, and sources</p>
          </div>
        </div>
      </div>
    </div>
  );
}
