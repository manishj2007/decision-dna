import React from 'react';
import { Decision } from '../types/index.js';

interface DecisionCardProps {
  decision: Decision;
}

export default function DecisionCard({ decision }: DecisionCardProps) {
  const statusColors = {
    active: 'bg-green-900/30 text-green-300 border-green-700',
    cancelled: 'bg-red-900/30 text-red-300 border-red-700',
    paused: 'bg-yellow-900/30 text-yellow-300 border-yellow-700',
    completed: 'bg-blue-900/30 text-blue-300 border-blue-700',
  };

  return (
    <div className="p-6 bg-slate-800 border border-slate-700 rounded-lg">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-white flex-1">{decision.summary}</h2>
        <span className={px-3 py-1 rounded text-sm font-semibold border }>
          {decision.status.charAt(0).toUpperCase() + decision.status.slice(1)}
        </span>
      </div>

      <p className="text-slate-300 mb-6">{decision.reason}</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-slate-400 mb-1">Confidence</p>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
              style={{ width: ${decision.confidence * 100}% }}
            />
          </div>
          <p className="text-sm text-slate-300 mt-1">{Math.round(decision.confidence * 100)}%</p>
        </div>
        <div>
          <p className="text-sm text-slate-400 mb-1">Made By</p>
          <p className="text-slate-200">{decision.madeBy || 'Unknown'}</p>
        </div>
      </div>

      {decision.madeAt && (
        <div className="mt-4 text-sm text-slate-400">
          Made on {new Date(decision.madeAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
