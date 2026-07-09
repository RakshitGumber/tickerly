import { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { fetchStatus } from "../api";

export default function Home() {
  useEffect(() => {
    fetchStatus();
  }, []);
  return (
    <div className="flex flex-col gap-8">
      <Navbar />
    </div>
  );
}
