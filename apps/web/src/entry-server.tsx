import { StrictMode } from "react";
import {
  type RenderToPipeableStreamOptions,
  renderToPipeableStream,
} from "react-dom/server";
import { createRoutes, matchRoute, RouterCtx } from "./Router";
import type { LoaderContext, RouterState } from "./Router";

export async function loadRouteData(
  url: string,
): Promise<RouterState | null> {
  const normalizedUrl = url || "/";
  const routes = createRoutes();
  const match = matchRoute(routes, normalizedUrl);

  if (!match) return null;

  const { route, params } = match;
  const [, queryString] = normalizedUrl.split("?");
  const fullUrl = new URL(normalizedUrl, "http://localhost").href;
  const ctx: LoaderContext = {
    params,
    search: new URLSearchParams(queryString ?? ""),
    request: new Request(fullUrl),
  };
  const data = route.loader ? await route.loader(ctx) : undefined;

  return { route, params, data };
}

export function render(
  routerState: RouterState | null,
  options?: RenderToPipeableStreamOptions,
) {
  if (!routerState) {
    return renderToPipeableStream(
      <StrictMode>
        <h1 className="text-2xl font-bold p-4">404 - Page Not Found</h1>
      </StrictMode>,
      options,
    );
  }

  const { route, data } = routerState;

  return renderToPipeableStream(
    <StrictMode>
      <RouterCtx.Provider value={routerState}>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__INITIAL_DATA__ = ${JSON.stringify(data)}`,
          }}
        />
        <route.component />
      </RouterCtx.Provider>
    </StrictMode>,
    options,
  );
}
