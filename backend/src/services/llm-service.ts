import axios from 'axios';
import { Evidence, Decision, TimelineEvent, Participant, Outcome } from '../types/index.js';
import { ILLMService } from '../types/index.js';
import { config } from '../config/index.js';
import { Logger } from '../utils/logger.js';

export class LLMService implements ILLMService {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = config.llm.apiKey;
    this.model = config.llm.model;
  }

  async extractDecision(query: string, evidence: Evidence[]): Promise<Decision> {
    if (!this.apiKey) {
      return this.buildMockDecision(query, evidence);
    }

    const prompt = this.buildDecisionPrompt(query, evidence);
    const response = await this.callLLM(prompt);
    return this.parseDecisionResponse(response, query, evidence);
  }

  async buildTimeline(decision: Decision, evidence: Evidence[]): Promise<TimelineEvent[]> {
    if (!this.apiKey) {
      return this.buildMockTimeline(evidence);
    }

    const prompt = this.buildTimelinePrompt(decision, evidence);
    const response = await this.callLLM(prompt);
    return this.parseTimelineResponse(response, evidence);
  }

  async extractOutcomes(decision: Decision, evidence: Evidence[]): Promise<Outcome[]> {
    if (!this.apiKey) {
      return this.buildMockOutcomes(decision, evidence);
    }

    const prompt = this.buildOutcomesPrompt(decision, evidence);
    const response = await this.callLLM(prompt);
    return this.parseOutcomesResponse(response, decision, evidence);
  }

  async extractParticipants(evidence: Evidence[]): Promise<Participant[]> {
    if (!this.apiKey) {
      return this.buildMockParticipants(evidence);
    }

    const prompt = this.buildParticipantsPrompt(evidence);
    const response = await this.callLLM(prompt);
    return this.parseParticipantsResponse(response, evidence);
  }

  private buildDecisionPrompt(query: string, evidence: Evidence[]): string {
    const evidenceText = evidence
      .map((e) => `Source: ${e.source}\nContent: ${e.excerpt}`)
      .join('\n\n');

    return `You are a business analyst. Based on the following evidence, extract the key business decision.

Query: ${query}

Evidence:
${evidenceText}

Respond with a JSON object containing:
{
  "summary": "Brief summary of the decision",
  "reason": "Why was this decision made",
  "status": "active|cancelled|paused|completed",
  "confidence": 0.0-1.0,
  "madeAt": "ISO date string",
  "madeBy": "Person or team name"
}`;
  }

  private buildTimelinePrompt(decision: Decision, evidence: Evidence[]): string {
    const evidenceText = evidence
      .map((e) => `${e.timestamp || 'Unknown'}: ${e.title} - ${e.excerpt}`)
      .join('\n');

    return `Based on this decision and evidence timeline, create a structured timeline of events.

Decision: ${decision.summary}

Evidence:
${evidenceText}

Respond with a JSON array of timeline events. Each event should have:
[
  {
    "date": "ISO date",
    "title": "Event title",
    "description": "What happened",
    "type": "discussion|decision|implementation|outcome"
  }
];`;
  }

  private buildOutcomesPrompt(decision: Decision, evidence: Evidence[]): string {
    const evidenceText = evidence.map((e) => e.excerpt).join('\n\n');

    return `Based on this decision and evidence, what were the observed outcomes?

Decision: ${decision.summary}

Evidence:
${evidenceText}

Respond with a JSON array of outcomes:
[
  {
    "description": "What was the outcome",
    "status": "positive|negative|neutral|unknown",
    "impact": "high|medium|low"
  }
];`;
  }

  private buildParticipantsPrompt(evidence: Evidence[]): string {
    const authors = evidence
      .filter((e) => e.author)
      .map((e) => e.author)
      .join(', ');

    return `Extract unique participants from this evidence. List their names, roles if mentioned, and estimate mention count.

Authors and mentions: ${authors}

Respond with JSON array:
[
  {
    "name": "Person name",
    "role": "Role if known",
    "mentions": number
  }
];`;
  }

  private async callLLM(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 2000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      Logger.error('LLM API call failed', error);
      return this.getMockDecisionResponse('', []);
    }
  }

  private getMockDecisionResponse(query: string, evidence: Evidence[]): string {
    return JSON.stringify(this.buildMockDecision(query, evidence));
  }

  private parseDecisionResponse(response: string, query: string, evidence: Evidence[]): Decision {
    try {
      const parsed = JSON.parse(response);
      return {
        id: `dec-${Date.now()}`,
        summary: parsed.summary || 'Unknown decision',
        reason: parsed.reason || 'No reason provided',
        status: parsed.status || 'active',
        confidence: parsed.confidence || 0.5,
        madeAt: parsed.madeAt,
        madeBy: parsed.madeBy,
      };
    } catch {
      return this.buildMockDecision(query, evidence);
    }
  }

  private parseTimelineResponse(response: string, evidence: Evidence[]): TimelineEvent[] {
    try {
      const parsed = JSON.parse(response);
      if (!Array.isArray(parsed)) {
        return this.buildMockTimeline(evidence);
      }

      return parsed.map((event: any, index: number) => ({
        date: event.date || new Date().toISOString(),
        title: event.title || 'Timeline event',
        description: event.description || '',
        type: event.type || 'discussion',
        source: evidence[index % evidence.length],
      }));
    } catch {
      return this.buildMockTimeline(evidence);
    }
  }

  private parseOutcomesResponse(response: string, decision: Decision, evidence: Evidence[]): Outcome[] {
    try {
      const parsed = JSON.parse(response);
      if (!Array.isArray(parsed)) {
        return this.buildMockOutcomes(decision, evidence);
      }

      return parsed.map((outcome: any, index: number) => ({
        id: `out-${index + 1}`,
        description: outcome.description || 'Unknown outcome',
        status: outcome.status || 'unknown',
        impact: outcome.impact || 'medium',
      }));
    } catch {
      return this.buildMockOutcomes(decision, evidence);
    }
  }

  private parseParticipantsResponse(response: string, evidence: Evidence[]): Participant[] {
    try {
      const parsed = JSON.parse(response);
      if (!Array.isArray(parsed)) {
        return this.buildMockParticipants(evidence);
      }

      return parsed.map((participant: any) => ({
        name: participant.name || 'Unknown',
        role: participant.role,
        mentions: participant.mentions || 1,
      }));
    } catch {
      return this.buildMockParticipants(evidence);
    }
  }

  private buildMockDecision(query: string, evidence: Evidence[]): Decision {
    const primaryEvidence = evidence[0];

    return {
      id: `dec-${Date.now()}`,
      summary: primaryEvidence?.title || `Decision related to "${query}"`,
      reason:
        primaryEvidence?.excerpt ||
        'Mock data is enabled because no LLM API key is configured. Add LLM_API_KEY to use live extraction.',
      status: query.toLowerCase().includes('cancel') ? 'cancelled' : 'completed',
      confidence: primaryEvidence?.confidence || 0.85,
      madeAt: primaryEvidence?.timestamp,
      madeBy: primaryEvidence?.author || 'DecisionDNA mock analysis',
    };
  }

  private buildMockTimeline(evidence: Evidence[]): TimelineEvent[] {
    return evidence
      .filter((ev) => ev.timestamp)
      .sort((a, b) => new Date(a.timestamp || '').getTime() - new Date(b.timestamp || '').getTime())
      .map((ev) => ({
        date: ev.timestamp || new Date().toISOString(),
        title: ev.title,
        description: ev.excerpt,
        source: ev,
        type: this.inferTimelineType(ev),
      }));
  }

  private buildMockOutcomes(decision: Decision, evidence: Evidence[]): Outcome[] {
    const outcomeEvidence = evidence.find((ev) => /completed|improvement|performance|outcome/i.test(ev.excerpt));

    return [
      {
        id: 'out-1',
        description: outcomeEvidence?.excerpt || `The observed result of "${decision.summary}" is still being tracked.`,
        status: outcomeEvidence ? 'positive' : 'unknown',
        impact: outcomeEvidence ? 'high' : 'medium',
        evidence: outcomeEvidence,
      },
    ];
  }

  private buildMockParticipants(evidence: Evidence[]): Participant[] {
    const counts = new Map<string, Participant>();

    for (const ev of evidence) {
      if (!ev.author) {
        continue;
      }

      const existing = counts.get(ev.author);
      counts.set(ev.author, {
        name: ev.author,
        role: existing?.role || this.inferRole(ev.author),
        mentions: (existing?.mentions || 0) + 1,
      });
    }

    return Array.from(counts.values());
  }

  private inferTimelineType(evidence: Evidence): TimelineEvent['type'] {
    const text = `${evidence.title} ${evidence.excerpt}`.toLowerCase();

    if (text.includes('completed') || text.includes('outcome') || text.includes('improvement')) {
      return 'outcome';
    }

    if (text.includes('removed') || text.includes('implementation')) {
      return 'implementation';
    }

    if (text.includes('decision') || text.includes('decided') || text.includes('cancelled')) {
      return 'decision';
    }

    return 'discussion';
  }

  private inferRole(author: string): string | undefined {
    if (author.toLowerCase().includes('team')) {
      return 'Team';
    }

    return undefined;
  }
}
