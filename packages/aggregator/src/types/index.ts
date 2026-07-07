export interface DailyReturn {
  date: Date;
  ticker: string;

  open: number;
  high: number;
  low: number;
  close: number;
  adjustedClose?: number;

  volume?: number;

  source: "yahoo" | "nasdaq" | "stooq";
}

export interface MarketProvider {
  fetchHistory(ticker: string, start: Date, end: Date): Promise<DailyReturn[]>;
}
