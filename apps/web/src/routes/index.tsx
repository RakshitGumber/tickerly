import { Link } from "../Router";

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Tickerly</h1>
      <p className="mb-4">Performance summarizer for your stock portfolio.</p>
      <nav className="flex gap-4">
        <Link to="/about" className="text-blue-600 hover:underline">About</Link>
      </nav>
    </div>
  );
}
