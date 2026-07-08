import { YahooProvider } from "../providers/yahoo";

const yahoo = new YahooProvider();

export interface IPrice {
  ticker: string;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  adjustedClose?: number;
  volume: number;
}

export class Returns {
  private providers: Array<YahooProvider>;

  constructor() {
    this.providers = [yahoo];
  }

  async getReturns(ticker: string, start: Date, end: Date): Promise<IPrice[]> {
    const results = await Promise.all(
      this.providers.map((provider) =>
        provider.fetchHistory(ticker, start, end),
      ),
    );

    const prices = results.flat();

    // Normalize the data to include the ticker
    return prices.map((d) => ({
      ticker: ticker.toUpperCase(), // Good practice: standardize ticker case
      date: d.date,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume,
    }));
  }
}
