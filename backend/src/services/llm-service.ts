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
    const prompt = this.buildDecisionPrompt(query, evidence);
    const response = await this.callLLM(prompt);
    return this.parseDecisionResponse(response);
  }

  async buildTimeline(decision: Decision, evidence: Evidence[]): Promise<TimelineEvent[]> {
    const prompt = this.buildTimelinePrompt(decision, evidence);
    const response = await this.callLLM(prompt);
    return this.parseTimelineResponse(response, evidence);
  }

  async extractOutcomes(decision: Decision, evidence: Evidence[]): Promise<Outcome[]> {
    const prompt = this.buildOutcomesPrompt(decision, evidence);
    const response = await this.callLLM(prompt);
    return this.parseOutcomesResponse(response);
  }

  async extractParticipants(evidence: Evidence[]): Promise<Participant[]> {
    const prompt = this.buildParticipantsPrompt(evidence);
    const response = await this.callLLM(prompt);
    return this.parseParticipantsResponse(response);
  }

  private buildDecisionPrompt(query: string, evidence: Evidence[]): string {
    const evidenceText = evidence
      .map((e) => Source: \nContent: )
      .join('\n\n');

    return You are a business analyst. Based on the following evidence, extract the key business decision.

Query: 

Evidence:


Respond with a JSON object containing:
{
  "summary": "Brief summary of the decision",
  "reason": "Why was this decision made",
  "status": "active|cancelled|paused|completed",
  "confidence": 0.0-1.0,
  "madeAt": "ISO date string",
  "madeBy": "Person or team name"
};
  }

  private buildTimelinePrompt(decision: Decision, evidence: Evidence[]): string {
    const evidenceText = evidence
      .map((e) => ${e.timestamp || 'Unknown'}:  - )
      .join('\n');

    return Based on this decision and evidence timeline, create a structured timeline of events.

Decision: 

Evidence:


Respond with a JSON array of timeline events. Each event should have:
[
  {
    "date": "ISO date",
    "title": "Event title",
    "description": "What happened",
    "type": "discussion|decision|implementation|outcome"
  }
];
  }

  private buildOutcomesPrompt(decision: Decision, evidence: Evidence[]): string {
    const evidenceText = evidence.map((e) => e.excerpt).join('\n\n');

    return Based on this decision and evidence, what were the observed outcomes?

Decision: 

Evidence:


Respond with a JSON array of outcomes:
[
  {
    "description": "What was the outcome",
    "status": "positive|negative|neutral|unknown",
    "impact": "high|medium|low"
  }
];
  }

  private buildParticipantsPrompt(evidence: Evidence[]): string {
    const authors = evidence
      .filter((e) => e.author)
      .map((e) => e.author)
      .join(', ');

    return Extract unique participants from this evidence. List their names, roles if mentioned, and estimate mention count.

Authors and mentions: 

Respond with JSON array:
[
  {
    "name": "Person name",
    "role": "Role if known",
    "mentions": number
  }
];
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
            Authorization: Bearer ,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      Logger.error('LLM API call failed', error);
      return this.getMockResponse();
    }
  }

  private getMockResponse(): string {
    return JSON.stringify({
      summary: 'Feature X was cancelled',
      reason: 'Resource constraints and shifting priorities',
      status: 'cancelled',
      confidence: 0.85,
      madeAt: '2024-01-15T10:30:00Z',
      madeBy: 'Engineering Leadership',
    });
  }

  private parseDecisionResponse(response: string): Decision {
    try {
      const parsed = JSON.parse(response);
      return {
        id: dec-,
        summary: parsed.summary || 'Unknown decision',
        reason: parsed.reason || 'No reason provided',
        status: parsed.status || 'active',
        confidence: parsed.confidence || 0.5,
        madeAt: parsed.madeAt,
        madeBy: parsed.madeBy,
      };
    } catch {
      return {
        id: dec-,
        summary: 'Unable to parse decision',
        reason: 'LLM parsing error',
        status: 'active',
        confidence: 0.3,
      };
    }
  }

  private parseTimelineResponse(response: string, evidence: Evidence[]): TimelineEvent[] {
    try {
      const parsed = JSON.parse(response);
      return parsed.map((event: any, index: number) => ({
        date: event.date || new Date().toISOString(),
        title: event.title || 'Timeline event',
        description: event.description || '',
        type: event.type || 'discussion',
        source: evidence[index % evidence.length],
      }));
    } catch {
      return [];
    }
  }

  private parseOutcomesResponse(response: string): Outcome[] {
    try {
      const parsed = JSON.parse(response);
      return parsed.map((outcome: any, index: number) => ({
        id: out--,
        description: outcome.description || 'Unknown outcome',
        status: outcome.status || 'unknown',
        impact: outcome.impact || 'medium',
      }));
    } catch {
      return [];
    }
  }

  private parseParticipantsResponse(response: string): Participant[] {
    try {
      const parsed = JSON.parse(response);
      return parsed.map((participant: any) => ({
        name: participant.name || 'Unknown',
        role: participant.role,
        mentions: participant.mentions || 1,
      }));
    } catch {
      return [];
    }
  }
}
