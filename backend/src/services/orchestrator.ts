import { Evidence, Decision, TimelineEvent, Participant, Outcome } from '../types/index.js';
import { IMCPAdapter, ILLMService } from '../types/index.js';
import { Logger } from '../utils/logger.js';

export class DecisionOrchestrator {
  constructor(
    private adapters: IMCPAdapter[],
    private llmService: ILLMService
  ) {}

  async reconstructDecision(query: string): Promise<{
    decision: Decision;
    timeline: TimelineEvent[];
    participants: Participant[];
    evidence: Evidence[];
    outcomes: Outcome[];
  }> {
    Logger.info('Starting decision reconstruction', { query });
    const startTime = Date.now();

    const evidence = await this.gatherEvidence(query);
    Logger.info('Evidence gathered', { count: evidence.length });

    const decision = await this.llmService.extractDecision(query, evidence);
    const timeline = await this.llmService.buildTimeline(decision, evidence);
    const participants = await this.llmService.extractParticipants(evidence);
    const outcomes = await this.llmService.extractOutcomes(decision, evidence);

    Logger.info('Decision reconstruction complete', {
      processingTimeMs: Date.now() - startTime,
    });

    return { decision, timeline, participants, evidence, outcomes };
  }

  private async gatherEvidence(query: string): Promise<Evidence[]> {
    const evidencePromises = this.adapters.map((adapter) =>
      adapter.search(query).catch((error) => {
        Logger.error("Error searching", error);
        return [];
      })
    );

    const results = await Promise.all(evidencePromises);
    const allEvidence = results.flat();
    const uniqueEvidence = Array.from(new Map(allEvidence.map((e) => [e.id, e])).values());

    return uniqueEvidence.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
  }
}
