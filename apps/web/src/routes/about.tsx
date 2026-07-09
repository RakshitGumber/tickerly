import { useRouteData, Link } from "../Router";
import type { LoaderContext } from "../Router";

export async function loader(_ctx: LoaderContext) {
  return { message: "Built with React 19, Vite 8, and Express" };
}

export default function About() {
  const data = useRouteData() as { message: string } | undefined;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">About</h1>
      {data && <p className="mb-4">{data.message}</p>}
      <Link to="/" className="text-blue-600 hover:underline">Home</Link>
    </div>
  );
}
