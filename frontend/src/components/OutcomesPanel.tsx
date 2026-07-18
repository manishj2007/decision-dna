import React from 'react';
import { Outcome } from '../types/index.js';

interface OutcomesPanelProps {
  outcomes: Outcome[];
}

export default function OutcomesPanel({ outcomes }: OutcomesPanelProps) {
  const statusIcons = {
    positive: '✅',
    negative: '❌',
    neutral: '⚪',
    unknown: '❓',
  };

  const impactColors = {
    high: 'text-red-400',
    medium: 'text-yellow-400',
    low: 'text-green-400',
  };

  return (
    <div className="p-6 bg-slate-800 border border-slate-700 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-6">Outcomes</h3>
      <div className="space-y-4">
        {outcomes.map((outcome) => (
          <div key={outcome.id} className="p-4 bg-slate-700/50 rounded border border-slate-600">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{statusIcons[outcome.status]}</span>
              <div className="flex-1">
                <p className="text-white font-semibold">{outcome.description}</p>
                <p className={	ext-sm mt-2 }>
                  Impact: {outcome.impact.charAt(0).toUpperCase() + outcome.impact.slice(1)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
