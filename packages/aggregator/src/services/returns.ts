// import { NasdaqProvider } from "../providers/nasdaq";
// import { StooqProvider } from "../providers/stooq";
import { YahooProvider } from "../providers/yahoo";

const yahoo = new YahooProvider();
// const nasdaq = new NasdaqProvider();
// const stooq = new StooqProvider();

// console.log(new Date("06-10-2005")); //mm-dd-yyyy

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
  providers: Array<YahooProvider>;

  constructor() {
    // this.providers = [nasdaq, yahoo, stooq];
    this.providers = [yahoo];
  }

  async getReturns(ticker: string, start: Date, end: Date): Promise<IPrice[]> {
    const data = await Promise.all(
      this.providers.map((provider) =>
        provider.fetchHistory(ticker, start, end),
      ),
    );
    const prices = data.flat();

    return prices.map((d) => ({
      ticker: ticker,
      date: d.date,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume,
    }));
  }
}
