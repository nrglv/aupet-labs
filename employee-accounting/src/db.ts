import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Pool } from 'pg';

const DEFAULT_URL = 'postgres://lab:lab@localhost:5432/employees';

export function createPool(): Pool {
  return new Pool({ connectionString: process.env.DATABASE_URL ?? DEFAULT_URL });
}

/** Создает таблицу employees, если ее еще нет. */
export async function initSchema(pool: Pool): Promise<void> {
  const sql = readFileSync(join(__dirname, '..', 'sql', 'schema.sql'), 'utf8');
  await pool.query(sql);
}
