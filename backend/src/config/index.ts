import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',
  llm: {
    provider: process.env.LLM_PROVIDER || 'nitrostack',
    apiKey: process.env.LLM_API_KEY || '',
    model: process.env.LLM_MODEL || 'gpt-4',
  },
  mcp: {
    github: {
      url: process.env.GITHUB_MCP_URL || 'http://localhost:3001',
    },
    slack: {
      url: process.env.SLACK_MCP_URL || 'http://localhost:3002',
    },
    notion: {
      url: process.env.NOTION_MCP_URL || 'http://localhost:3003',
    },
  },
  useMockData: process.env.USE_MOCK_DATA === 'true',
};
