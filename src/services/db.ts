import { buildSeedDb } from '@/data/seed';
import type { DbShape } from '@/types';
import { readJson, removeKey, writeJson } from '@/utils/storage';

/**
 * Local "database" for the front-end demo, persisted in localStorage.
 *
 * IMPORTANT: localStorage is NOT a secure database. It is used here only so
 * the demo keeps its state between reloads. Every service below exposes an
 * async API shaped like a real REST client, so swapping this module for a
 * fetch-based implementation (or Firebase/Supabase) requires no UI changes.
 */
const DB_KEY = 'siymon.db.v1';

let cache: DbShape | null = null;

export function getDb(): DbShape {
  if (!cache) {
    const stored = readJson<DbShape | null>(DB_KEY, null);
    if (stored && stored.version === 1 && Array.isArray(stored.products)) {
      cache = stored;
    } else {
      cache = buildSeedDb();
      writeJson(DB_KEY, cache);
    }
  }
  return cache;
}

export function persist(): void {
  if (cache) writeJson(DB_KEY, cache);
}

/** Run a synchronous mutation against the db and persist the result. */
export function mutate<T>(fn: (db: DbShape) => T): T {
  const db = getDb();
  const result = fn(db);
  persist();
  return result;
}

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Wipe local demo data and restore the original seed. */
export function resetDb(): void {
  cache = buildSeedDb();
  persist();
}

export function clearDbStorage(): void {
  removeKey(DB_KEY);
  cache = null;
}

/** Simulated network latency so loading states are visible and realistic. */
export function delay(ms = 140): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
