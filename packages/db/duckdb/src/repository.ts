import { db } from "./client";
import type { IPrice } from "@tickerly/aggregator";

export async function insertPrices(prices: IPrice[]) {
  if (prices.length === 0) return;

  const sql = `
    INSERT INTO prices (ticker, date, open, high, low, close, adjusted_close, volume)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT (ticker, date) DO UPDATE SET
      open = excluded.open,
      high = excluded.high,
      low = excluded.low,
      close = excluded.close,
      adjusted_close = excluded.adjusted_close,
      volume = excluded.volume;
  `;

  // Insert sequentially. It is slightly slower than bulk, but 100% prevents
  // the DuckDB C++ bindings from crashing on weird JS types.
  for (const p of prices) {
    const params = [
      String(p.ticker), // Force String
      p.date.toISOString().split("T")[0], // Force YYYY-MM-DD String
      Number(p.open), // Force Number
      Number(p.high), // Force Number
      Number(p.low), // Force Number
      Number(p.close), // Force Number
      p.adjustedClose != null ? Number(p.adjustedClose) : null, // Force Number or null
      Number(p.volume), // Force Number (Fixes the BigInt crash)
    ];

    await new Promise<void>((resolve, reject) => {
      // Prepare a fresh statement for every row to avoid C++ pointer reuse bugs
      const stmt = db.prepare(sql);

      stmt.run(...params, (err) => {
        stmt.finalize(); // Always finalize immediately in sequential loops
        if (err) {
          console.error("Failed to insert row:", params, err);
          return reject(err);
        }
        resolve();
      });
    });
  }
}
