import express from 'express';
import { getDepartmentSummaryHandler } from './controllers/userController.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/api/users/department-summary', getDepartmentSummaryHandler);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
