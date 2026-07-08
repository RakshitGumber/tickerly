import { run } from "./client";

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
