import type { IPrice } from "@tickerly/aggregator";
import { db, run } from "./client";

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

  // 1. Map each object into a raw SQL string tuple: ('AAPL', '2023-01-01', 150.5, ...)
  // We explicitly cast to String/Number to guarantee no weird JS types leak in.
  const valueStrings = prices.map((p) => {
    const ticker = String(p.ticker).replace(/'/g, "''"); // Escape single quotes for SQL
    const date = p.date.toISOString().split("T")[0]; // YYYY-MM-DD
    const open = Number(p.open);
    const high = Number(p.high);
    const low = Number(p.low);
    const close = Number(p.close);
    const adjClose = p.adjustedClose != null ? Number(p.adjustedClose) : "NULL";
    const volume = Number(p.volume);

    return `('${ticker}', '${date}', ${open}, ${high}, ${low}, ${close}, ${adjClose}, ${volume})`;
  });

  // 2. Combine them into a single bulk insert statement
  const sql = `
    INSERT INTO prices (ticker, date, open, high, low, close, adjusted_close, volume) 
    VALUES 
      ${valueStrings.join(",\n      ")}
    ON CONFLICT (ticker, date) DO UPDATE SET
      open = excluded.open,
      high = excluded.high,
      low = excluded.low,
      close = excluded.close,
      adjusted_close = excluded.adjusted_close,
      volume = excluded.volume;
  `;

  // 3. Execute as a single raw query (no parameter array!)
  await run(sql);
}

// export async function hasTicker(ticker: string): Promise<boolean> {
//   const sql = `
//     SELECT EXISTS(
//       SELECT 1
//       FROM prices
//       WHERE ticker = ?
//     ) AS exists;
//   `;

//   return new Promise((resolve, reject) => {
//     db.get(sql, ticker, (err, row: any) => {
//       if (err) return reject(err);

//       resolve(Boolean(row.exists));
//     });
//   });
// }

export async function getPrices(
  ticker: string,
  start: Date,
  end: Date,
): Promise<IPrice[]> {
  const sql = `
    SELECT
      ticker,
      date,
      open,
      high,
      low,
      close,
      adjusted_close,
      volume
    FROM prices
    WHERE ticker = ?
      AND date BETWEEN ? AND ?
    ORDER BY date;
  `;

  return new Promise((resolve, reject) => {
    db.all(
      sql,
      ticker,
      start.toISOString().slice(0, 10),
      end.toISOString().slice(0, 10),
      (err, rows: any[]) => {
        if (err) return reject(err);

        resolve(
          rows.map((r) => ({
            ticker: r.ticker,
            date: new Date(r.date),
            open: Number(r.open),
            high: Number(r.high),
            low: Number(r.low),
            close: Number(r.close),
            adjustedClose:
              r.adjusted_close == null ? undefined : Number(r.adjusted_close),
            volume: Number(r.volume),
          })),
        );
      },
    );
  });
}

// export async function getLatestDate(ticker: string): Promise<Date | null> {
//   const sql = `
//     SELECT MAX(date) AS latest
//     FROM prices
//     WHERE ticker = ?;
//   `;

//   return new Promise((resolve, reject) => {
//     db.get(sql, ticker, (err, row: any) => {
//       if (err) return reject(err);

//       resolve(row?.latest ? new Date(row.latest) : null);
//     });
//   });
// }

export async function deleteTicker(ticker: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM prices WHERE ticker = ?`, ticker, (err) => {
      if (err) return reject(err);

      resolve();
    });
  });
}
