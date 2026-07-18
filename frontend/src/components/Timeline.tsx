import { TimelineEvent } from '../types/index.js';

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  const typeColors = {
    discussion: 'bg-blue-500',
    decision: 'bg-purple-500',
    implementation: 'bg-green-500',
    outcome: 'bg-orange-500',
  };

  return (
    <div className="p-6 bg-slate-800 border border-slate-700 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-6">Timeline</h3>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={`${event.date}-${event.title}-${index}`} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${typeColors[event.type]}`} />
              {index < events.length - 1 && <div className="w-0.5 h-12 bg-slate-700 mt-2" />}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-sm text-slate-400">{new Date(event.date).toLocaleDateString()}</p>
              <p className="font-semibold text-white">{event.title}</p>
              <p className="text-sm text-slate-300 mt-1">{event.description}</p>
              <p className="text-xs text-slate-500 mt-2">From: {event.source.source}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
