import { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { fetchReturns } from "../api";
import { useTicker } from "../store/useTicker";

export default function Home() {
  const { ticker } = useTicker((state) => state);

  const populateTable = async () => {
    if (ticker === null) {
      return;
    }
    const data = await fetchReturns(ticker);
    console.log(data);
  };

  useEffect(() => {
    populateTable();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <Navbar />
      <main className="max-w-6xl w-full mx-auto px-8 py-2 flex flex-col">
        <section className="flex w-full justify-between items-center">
          <h1 className="text-4xl font-semibold">
            {ticker ?? "Enter a Ticker"}
          </h1>
          <button
            className="bg-green-400 text-xl px-6 py-2 font-semibold"
            onClick={populateTable}
          >
            Fetch
          </button>
        </section>
      </main>
    </div>
  );
}
