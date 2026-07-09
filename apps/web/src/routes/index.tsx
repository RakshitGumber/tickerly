import { Navbar } from "../components/Navbar";
import { RawReturns } from "../components/RawReturns";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <Navbar />
      <RawReturns />
    </div>
  );
}
