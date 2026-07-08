import duckdb from "duckdb";
import path from "path";

const dbPath = path.join(import.meta.dir, "../data/market.duckdb");

export const db = new duckdb.Database(dbPath);

export function query<T = any>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);

      resolve(rows as T[]);
    });
  });
}

export function run(sql: string, params: unknown[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) return reject(err);

      resolve();
    });
  });
}
