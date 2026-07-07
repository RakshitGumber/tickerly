import { NasdaqProvider } from "../providers/nasdaq";
import { StooqProvider } from "../providers/stooq";
import { YahooProvider } from "../providers/yahoo";

const yahoo = new YahooProvider();
const nasdaq = new NasdaqProvider();
const stooq = new StooqProvider();

// console.log(new Date("06-10-2005")); //mm-dd-yyyy

class Returns {
  providers: Array<any>;

  constructor(providers: []) {
    this.providers = [nasdaq, yahoo, stooq];
  }

  async getReturns(ticker: string, start: Date, end: Date) {
    this.providers.forEach((provider) => {
      provider.fetchHistory(ticker, start, end);
    });
  }
}
