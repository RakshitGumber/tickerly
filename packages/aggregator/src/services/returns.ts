import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

const quote = await yahooFinance.historical("AAPL");
const { regularMarketPrice, currency } = quote;

console.log(regularMarketPrice, "\n", currency);
