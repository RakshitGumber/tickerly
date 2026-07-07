// import YahooFinance from "yahoo-finance2";

// const yahooFinance = new YahooFinance();

// const quote = await yahooFinance.historical("AAPL");
// const { regularMarketPrice, currency } = quote;

// console.log(regularMarketPrice, "\n", currency);

export class YahooProvider {
  async fetchHistory(ticker: string, start: Date, end: Date) {
    console.log(
      `fetching returns from Yahoo for ${ticker}. From: ${start}, to: ${end}`,
    );
  }
}
