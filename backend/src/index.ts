import express, { Express } from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { Logger } from './utils/logger.js';
import searchRoutes from './routes/search.js';

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use('/api', searchRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(config.port, () => {
  Logger.info(`DecisionDNA backend running on port ${config.port}`);
});