import { run } from "./client";

export async function createTables() {
  await run(`
    CREATE TABLE IF NOT EXISTS prices (
        ticker VARCHAR,
        date DATE,
        open DOUBLE,
        high DOUBLE,
        low DOUBLE,
        close DOUBLE,
        volume BIGINT
    );
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_prices
    ON prices(ticker, date);
  `);
}
