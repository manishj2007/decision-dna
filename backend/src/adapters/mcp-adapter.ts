import { Evidence, IMCPAdapter } from '../types/index.js';
import { mockEvidenceData } from '../data/mock.js';
import { Logger } from '../utils/logger.js';

export class MockMCPAdapter implements IMCPAdapter {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  async search(query: string): Promise<Evidence[]> {
    Logger.debug(`Searching ${this.name} for: ${query}`);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const tokens = query
      .toLowerCase()
      .split(/\W+/)
      .filter((token) => token.length > 2);

    if (tokens.length === 0) {
      return mockEvidenceData;
    }

    const scoredEvidence = mockEvidenceData
      .map((ev) => {
        const haystack = `${ev.title} ${ev.excerpt} ${ev.source} ${ev.author || ''}`.toLowerCase();
        const score = tokens.filter((token) => haystack.includes(token)).length;
        return { ev, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || (b.ev.confidence || 0) - (a.ev.confidence || 0))
      .map(({ ev }) => ev);

    return scoredEvidence.length > 0 ? scoredEvidence : mockEvidenceData;
  }

  getName(): string {
    return this.name;
  }
}

export class GitHubAdapter extends MockMCPAdapter {
  constructor() {
    super('GitHub');
  }
}

export class SlackAdapter extends MockMCPAdapter {
  constructor() {
    super('Slack');
  }
}

export class NotionAdapter extends MockMCPAdapter {
  constructor() {
    super('Notion');
  }
}
