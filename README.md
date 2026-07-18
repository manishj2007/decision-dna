# DecisionDNA - Hackathon MVP

Ask why any business decision was made.

DecisionDNA reconstructs the complete story behind a decision by gathering evidence from multiple sources (Slack, GitHub, Notion) and using AI to extract insights.

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Setup

1. Install backend dependencies:
   cd backend
   npm install
   cd ..

2. Install frontend dependencies:
   cd frontend
   npm install
   cd ..

3. Create backend .env:
   cp backend/.env.example backend/.env
   Edit backend/.env and add your LLM API key

### Running

Terminal 1 - Start backend:
   cd backend
   npm run dev

Terminal 2 - Start frontend:
   cd frontend
   npm run dev

Frontend will be available at http://localhost:5173
Backend API at http://localhost:5000

## Architecture

Backend (Node.js + Express):
- /api/search-decision - Main search endpoint
- MCP adapters for GitHub, Slack, Notion (mock implementations)
- LLM integration for decision extraction
- Decision orchestrator to coordinate everything

Frontend (React + Vite + Tailwind):
- Landing page with search
- Results page with decision card, timeline, evidence, outcomes
- Source citations and participant extraction

## Features

- Natural language decision search
- Decision reconstruction from fragmented evidence
- Timeline generation
- Evidence explorer
- Outcome analysis
- Source citations

## Mock Data

Currently uses mock data for demonstration. Adapters are ready to connect to real MCP servers:
- GitHub MCP
- Slack MCP
- Notion MCP

## Deployment

Backend: Can be deployed to any Node.js hosting (Vercel, Heroku, AWS Lambda)
Frontend: Can be deployed to any static hosting (Vercel, Netlify, GitHub Pages)
