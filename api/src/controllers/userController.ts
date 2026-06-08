import type { Request, Response } from 'express';
import { getDepartmentSummary } from '../services/userService.js';

export async function getDepartmentSummaryHandler(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const data = await getDepartmentSummary();
    res.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[getDepartmentSummary] Error:', message);
    res.status(500).json({ error: 'Failed to fetch department summary', detail: message });
  }
}
