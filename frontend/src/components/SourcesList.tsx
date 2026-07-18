import React from 'react';

interface Source {
  id: string;
  title: string;
  url: string;
}

interface SourcesListProps {
  sources: Source[];
}

export default function SourcesList({ sources }: SourcesListProps) {
  return (
    <div className="p-6 bg-slate-800 border border-slate-700 rounded-lg">
      <h3 className="text-lg font-bold text-white mb-4">Sources</h3>
      <div className="space-y-2">
        {sources.map((source) => (
          <a
            key={source.id}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-slate-700/50 hover:bg-slate-700 rounded border border-slate-600 hover:border-blue-500 transition text-sm"
          >
            <p className="text-blue-400 hover:text-blue-300 truncate">{source.title}</p>
            <p className="text-xs text-slate-500 truncate mt-1">{source.url}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
