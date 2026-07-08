import duckdb from "duckdb";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "../data/market.duckdb");

export const db = new duckdb.Database(dbPath);

export function query<T>(sql: string, params: unknown[] = []) {
  return new Promise<T[]>((resolve, reject) => {
    const stmt = db.prepare(sql);

    stmt.all(...params, (err, rows) => {
      stmt.finalize();

      if (err) return reject(err);

      resolve(rows as T[]);
    });
  });
}

export function run(sql: string, params: unknown[] = []) {
  return new Promise<void>((resolve, reject) => {
    const stmt = db.prepare(sql);

    stmt.run(...params, (err) => {
      stmt.finalize();

      if (err) return reject(err);

      resolve();
    });
  });
}

export function batchRun(sql: string, paramsMatrix: unknown[][]) {
  return new Promise<void>((resolve, reject) => {
    const stmt = db.prepare(sql);
    stmt.run(paramsMatrix, (err) => {
      stmt.finalize();
      if (err) return reject(err);
      resolve();
    });
  });
}

export async function closeDatabase() {
  return new Promise<void>((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
