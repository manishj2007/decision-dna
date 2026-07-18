export interface Evidence {
  id: string;
  title: string;
  type: 'slack' | 'github' | 'notion' | 'email';
  source: string;
  url: string;
  excerpt: string;
  timestamp?: string;
  author?: string;
  confidence?: number;
}

export interface Participant {
  name: string;
  email?: string;
  role?: string;
  mentions?: number;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  source: Evidence;
  type: 'discussion' | 'decision' | 'implementation' | 'outcome';
}

export interface Decision {
  id: string;
  summary: string;
  reason: string;
  status: 'active' | 'cancelled' | 'paused' | 'completed';
  confidence: number;
  madeAt?: string;
  madeBy?: string;
}

export interface Outcome {
  id: string;
  description: string;
  status: 'positive' | 'negative' | 'neutral' | 'unknown';
  impact: 'high' | 'medium' | 'low';
  evidence?: Evidence;
}

export interface DecisionResult {
  decision: Decision;
  timeline: TimelineEvent[];
  participants: Participant[];
  evidence: Evidence[];
  outcomes: Outcome[];
  sources: Array<{
    id: string;
    title: string;
    url: string;
  }>;
  metadata: {
    searchQuery: string;
    timestamp: string;
    processingTimeMs: number;
  };
}

export interface IMCPAdapter {
  search(query: string): Promise<Evidence[]>;
  getName(): string;
}

export interface ILLMService {
  extractDecision(query: string, evidence: Evidence[]): Promise<Decision>;
  buildTimeline(decision: Decision, evidence: Evidence[]): Promise<TimelineEvent[]>;
  extractOutcomes(decision: Decision, evidence: Evidence[]): Promise<Outcome[]>;
  extractParticipants(evidence: Evidence[]): Promise<Participant[]>;
}

export interface SearchRequest {
  query: string;
}

export interface SearchResponse {
  success: boolean;
  data?: DecisionResult;
  error?: string;
}
