import { Router, Request, Response } from 'express';
import { DecisionOrchestrator } from '../services/orchestrator.js';
import { LLMService } from '../services/llm-service.js';
import { GitHubAdapter, SlackAdapter, NotionAdapter } from '../adapters/mcp-adapter.js';
import { SearchRequest, SearchResponse } from '../types/index.js';
import { Logger } from '../utils/logger.js';

const router = Router();

const orchestrator = new DecisionOrchestrator(
  [new GitHubAdapter(), new SlackAdapter(), new NotionAdapter()],
  new LLMService()
);

router.post('/search-decision', async (req: Request, res: Response) => {
  try {
    const { query } = req.body as SearchRequest;

    if (!query || query.trim().length === 0) {
      const response: SearchResponse = {
        success: false,
        error: 'Query is required',
      };
      return res.status(400).json(response);
    }

    Logger.info('Search request received', { query });

    const startTime = Date.now();
    const result = await orchestrator.reconstructDecision(query);
    const processingTimeMs = Date.now() - startTime;

    const response: SearchResponse = {
      success: true,
      data: {
        decision: result.decision,
        timeline: result.timeline,
        participants: result.participants,
        evidence: result.evidence,
        outcomes: result.outcomes,
        sources: result.evidence.map((e) => ({
          id: e.id,
          title: e.title,
          url: e.url,
        })),
        metadata: {
          searchQuery: query,
          timestamp: new Date().toISOString(),
          processingTimeMs,
        },
      },
    };

    res.json(response);
  } catch (error) {
    Logger.error('Search error', error);
    const response: SearchResponse = {
      success: false,
      error: 'Internal server error',
    };
    res.status(500).json(response);
  }
});

export default router;
