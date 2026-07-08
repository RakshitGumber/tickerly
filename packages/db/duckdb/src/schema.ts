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
