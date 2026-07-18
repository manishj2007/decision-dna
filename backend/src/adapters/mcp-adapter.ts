import { Evidence, IMCPAdapter } from '../types/index.js';
import { mockEvidenceData } from '../data/mock.js';
import { Logger } from '../utils/logger.js';

export class MockMCPAdapter implements IMCPAdapter {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  async search(query: string): Promise<Evidence[]> {
    Logger.debug(Searching  for: );
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockEvidenceData.filter((ev) =>
      ev.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      ev.title.toLowerCase().includes(query.toLowerCase())
    );
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
