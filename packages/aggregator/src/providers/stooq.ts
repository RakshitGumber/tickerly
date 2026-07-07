export class StooqProvider {
  async fetchHistory(ticker: string, start: Date, end: Date) {
    console.log(
      `fetching returns from Stooq for ${ticker}. From: ${start}, to: ${end}`,
    );
  }
}
