import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { fetchReturns } from "../api";
import { useTicker } from "../store/useTicker";

export default function Home() {
  const { ticker } = useTicker((state) => state);
  const [returns, setReturns] = useState<Array<any>>([]);

  const populateTable = async () => {
    if (ticker === null) {
      return;
    }
    const data = await fetchReturns(ticker);
    setReturns(data.data);
  };
  return (
    <div className="flex flex-col gap-8">
      <Navbar />
      <main className="max-w-6xl w-full mx-auto gap-20 mb-24 px-8 py-2 flex flex-col">
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
        {returns?.length === 0 ? (
          <h2>Enter a valid ticker to search</h2>
        ) : (
          <table className="">
            <thead>
              <tr className="py-2 border">
                <th className="border">Date</th>
                <th className="border">Open</th>
                <th className="border">High</th>
                <th className="border">Low</th>
                <th className="border">Close</th>
                <th className="border">Volume</th>
              </tr>
            </thead>
            <tbody>
              {returns?.map((d) => (
                <tr key={d.date}>
                  <td>{d.date.split("T")[0]}</td>
                  <td>{Number(d.open).toFixed(2)}</td>
                  <td>{Number(d.high).toFixed(2)}</td>
                  <td>{Number(d.low).toFixed(2)}</td>
                  <td>{Number(d.close).toFixed(2)}</td>
                  <td>{Number(d.volume)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
