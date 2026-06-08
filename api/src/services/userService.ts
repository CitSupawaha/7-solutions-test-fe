import type { DummyJsonResponse, DepartmentGroupResult } from '../types/index.js';
import { groupUsersByDepartment } from '../utils/transformer.js';

const API_URL = 'https://dummyjson.com/users';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  data: DepartmentGroupResult;
  timestamp: number;
}

let cache: CacheEntry | null = null;

function isCacheValid(): boolean {
  return cache !== null && Date.now() - cache.timestamp < CACHE_TTL_MS;
}

/**
 * Fetches all users from dummyjson API with pagination support,
 * transforms them into department summaries, and caches the result.
 */
export async function getDepartmentSummary(): Promise<DepartmentGroupResult> {
  if (isCacheValid()) {
    return cache!.data;
  }

  // Fetch all users (API returns paginated, default limit=30)
  // First request to get total count
  const firstResponse = await fetch(`${API_URL}?limit=0&select=firstName,lastName,age,gender,hair,address,company`);

  if (!firstResponse.ok) {
    throw new Error(`API request failed: ${firstResponse.status} ${firstResponse.statusText}`);
  }

  const firstData = (await firstResponse.json()) as DummyJsonResponse;
  const total = firstData.total;

  // Fetch all users in one request
  const response = await fetch(`${API_URL}?limit=${total}&select=firstName,lastName,age,gender,hair,address,company`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as DummyJsonResponse;
  const result = groupUsersByDepartment(data.users);

  // Update cache
  cache = { data: result, timestamp: Date.now() };

  return result;
}

/** Clears the in-memory cache (useful for testing). */
export function clearCache(): void {
  cache = null;
}
