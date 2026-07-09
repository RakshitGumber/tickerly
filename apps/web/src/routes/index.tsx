import { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { fetchReturns } from "../api";

export default function Home() {
  const populateTable = async () => {
    const data = await fetchReturns("SPY");
    console.log(data);
  };

  useEffect(() => {
    populateTable();
  }, []);
  
  return (
    <div className="flex flex-col gap-8">
      <Navbar />
    </div>
  );
}
