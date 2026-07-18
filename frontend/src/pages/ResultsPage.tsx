import { DecisionResult } from '../types/index.js';
import DecisionCard from '../components/DecisionCard.js';
import Timeline from '../components/Timeline.js';
import EvidencePanel from '../components/EvidencePanel.js';
import OutcomesPanel from '../components/OutcomesPanel.js';
import SourcesList from '../components/SourcesList.js';

interface ResultsPageProps {
  result: DecisionResult;
  onBack: () => void;
}

export default function ResultsPage({ result, onBack }: ResultsPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="mb-8 px-4 py-2 text-slate-400 hover:text-white transition"
        >
          Back to Search
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <DecisionCard decision={result.decision} />
            <Timeline events={result.timeline} />
            <OutcomesPanel outcomes={result.outcomes} />
          </div>

          <div className="space-y-8">
            <EvidencePanel evidence={result.evidence} participants={result.participants} />
            <SourcesList sources={result.sources} />
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          Processing time: {result.metadata.processingTimeMs}ms | Confidence:{' '}
          {Math.round(result.decision.confidence * 100)}%
        </div>
      </div>
    </div>
  );
}
