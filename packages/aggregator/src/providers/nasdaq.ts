export class NasdaqProvider {
  async fetchHistory(ticker: string, start: Date, end: Date) {
    console.log(
      `fetching returns from Nasdaq for ${ticker}. From: ${start}, to: ${end}`,
    );
  }
}
