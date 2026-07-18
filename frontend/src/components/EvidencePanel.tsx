import React from 'react';
import { Evidence, Participant } from '../types/index.js';

interface EvidencePanelProps {
  evidence: Evidence[];
  participants: Participant[];
}

export default function EvidencePanel({ evidence, participants }: EvidencePanelProps) {
  const typeIcons = {
    slack: '💬',
    github: '🐙',
    notion: '📄',
    email: '📧',
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-800 border border-slate-700 rounded-lg">
        <h3 className="text-lg font-bold text-white mb-4">Evidence ({evidence.length})</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {evidence.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-slate-700/50 hover:bg-slate-700 rounded border border-slate-600 hover:border-slate-500 transition"
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">{typeIcons[item.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{item.source}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="p-6 bg-slate-800 border border-slate-700 rounded-lg">
        <h3 className="text-lg font-bold text-white mb-4">Participants ({participants.length})</h3>
        <div className="space-y-2">
          {participants.map((participant, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{participant.name}</p>
                {participant.role && <p className="text-xs text-slate-400">{participant.role}</p>}
              </div>
              <span className="text-sm text-slate-400">{participant.mentions} mentions</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
