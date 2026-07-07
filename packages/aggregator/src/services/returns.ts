// import { NasdaqProvider } from "../providers/nasdaq";
// import { StooqProvider } from "../providers/stooq";
import { YahooProvider } from "../providers/yahoo";

const yahoo = new YahooProvider();
// const nasdaq = new NasdaqProvider();
// const stooq = new StooqProvider();

// console.log(new Date("06-10-2005")); //mm-dd-yyyy

interface IReturn {
  date: Date;
  returns: number;
}
export class Returns {
  providers: Array<YahooProvider>;

  constructor() {
    // this.providers = [nasdaq, yahoo, stooq];
    this.providers = [yahoo];
  }

  async getReturns(ticker: string, start: Date, end: Date): Promise<IReturn[]> {
    const data = await Promise.all(
      this.providers.map((provider) =>
        provider.fetchHistory(ticker, start, end),
      ),
    );
    const prices = data.flat();

    return prices.map((d) => ({
      date: d.date,
      returns: (d.close - d.open) / d.open,
    }));
  }
}
