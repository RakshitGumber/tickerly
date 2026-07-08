import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export interface IProviderPrice {
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
  ): Promise<IProviderPrice[]> {
    try {
      const chart = await yahooFinance.chart(ticker, {
        period1: start,
        period2: end,
        interval: "1d",
      });

      const result = Array.isArray(chart) ? chart[0] : chart;

      if (!result?.quotes) return [];

      return result.quotes
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
    } catch (error) {
      console.error(`Yahoo request failed for ${ticker}:`, error);
      return [];
    }
  }
}
