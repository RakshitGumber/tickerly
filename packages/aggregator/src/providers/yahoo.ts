import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

interface IPrice {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
export class YahooProvider {
  async fetchHistory(
    ticker: string,
    start: Date,
    end: Date,
  ): Promise<IPrice[]> {
    try {
      const chart = await yahooFinance.chart(ticker, {
        period1: start,
        period2: end,
        interval: "1d",
      });

      // chart() can theoretically return an array, normalize it.
      const result = Array.isArray(chart) ? chart[0] : chart;

      if (!result) {
        console.warn(`No chart data returned for ${ticker}`);
        return [];
      }

      const quotes = result.quotes ?? [];
      const prices: IPrice[] = quotes
        .filter(
          (q: any) =>
            q.date instanceof Date &&
            q.open != null &&
            q.high != null &&
            q.low != null &&
            q.close != null &&
            q.volume != null,
        )
        .map((q: any) => ({
          date: q.date,
          open: q.open,
          high: q.high,
          low: q.low,
          close: q.close,
          volume: q.volume,
        }))
        .sort((a: any, b: any) => a.date.getTime() - b.date.getTime());

      return prices;
    } catch (error) {
      console.error(`Yahoo request failed for ${ticker}:`, error);
      return [];
    }
  }
}

// async function main() {
//   const provider = new YahooProvider();

//   const history = await provider.fetchHistory(
//     "AAPL", // <-- not APPL
//     new Date("2005-06-10"),
//     new Date(),
//   );

//   console.log(history);
// }

// main();
