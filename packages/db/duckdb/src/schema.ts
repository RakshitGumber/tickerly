import { batchRun, run } from "./client";

export async function createTables() {
  await run(`
      CREATE TABLE IF NOT EXISTS prices (
          ticker VARCHAR NOT NULL,
          date DATE NOT NULL,

          open DOUBLE NOT NULL,
          high DOUBLE NOT NULL,
          low DOUBLE NOT NULL,
          close DOUBLE NOT NULL,

          adjusted_close DOUBLE,

          volume BIGINT,

          PRIMARY KEY (ticker, date)
      );
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_prices
    ON prices(ticker, date);
  `);
}

export async function insertPrices(prices: Array<any>) {
  if (prices.length === 0) return;

  // Map objects to arrays matching the exact column order
  const values = prices.map((p) => [
    p.ticker,
    p.date.toISOString().split("T")[0], // DuckDB DATE type expects YYYY-MM-DD string
    p.open,
    p.high,
    p.low,
    p.close,
    p.adjustedClose ?? null,
    p.volume,
  ]);

  await batchRun(
    `INSERT INTO prices (ticker, date, open, high, low, close, adjusted_close, volume) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    values,
  );
}
