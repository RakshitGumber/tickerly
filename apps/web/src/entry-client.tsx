import "./main.css";
import { StrictMode, useState, useEffect, useRef } from "react";
import { hydrateRoot } from "react-dom/client";
import { createRoutes, matchRoute, RouterCtx } from "./Router";
import type { Route, RouterState } from "./Router";

const routes = createRoutes();

function App() {
  const [currentUrl, setCurrentUrl] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setCurrentUrl(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const match = matchRoute(routes, currentUrl);

  if (!match) {
    return <h1 className="text-2xl font-bold p-4">404 - Page Not Found</h1>;
  }

  return <RouteRenderer route={match.route} params={match.params} />;
}

function RouteRenderer({
  route,
  params,
}: {
  route: Route;
  params: Record<string, string>;
}) {
  const [data, setData] = useState<unknown>(() => {
    const g = globalThis as Record<string, unknown>;
    if ("__INITIAL_DATA__" in g) {
      const d = g.__INITIAL_DATA__;
      delete g.__INITIAL_DATA__;
      return d;
    }
    return undefined;
  });

  const loadedFromSSR = useRef(data !== undefined);

  useEffect(() => {
    if (loadedFromSSR.current) {
      loadedFromSSR.current = false;
      return;
    }

    if (route.loader) {
      const ctx = {
        params,
        search: new URLSearchParams(window.location.search),
        request: new Request(window.location.href),
      };
      route.loader(ctx).then(setData);
    } else {
      setData(undefined);
    }
  }, [route, params]);

  const routerState: RouterState = { route, params, data };

  return (
    <RouterCtx.Provider value={routerState}>
      <route.component />
    </RouterCtx.Provider>
  );
}

hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <StrictMode>
    <App />
  </StrictMode>,
);
