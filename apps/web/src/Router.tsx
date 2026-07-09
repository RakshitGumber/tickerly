import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";
import type { Route, LoaderContext } from "./route";
export type { Route, LoaderContext };

// ── Context ──────────────────────────────────────────────────────────────────

export interface RouterState {
  route: Route;
  params: Record<string, string>;
  data: unknown;
}

export const RouterCtx = createContext<RouterState | null>(null);

export function useRouter() {
  const ctx = useContext(RouterCtx);
  if (!ctx) throw new Error("useRouter must be used within RouterCtx.Provider");
  return ctx;
}

export function useParams() {
  return useRouter().params;
}

export function useRouteData() {
  return useRouter().data;
}

// ── Route discovery (Vite glob import) ───────────────────────────────────────

export function createRoutes(): Route[] {
  const pages = import.meta.glob<{
    default: React.ComponentType<any>;
    loader?: (ctx: LoaderContext) => Promise<any>;
  }>("./routes/**/*.tsx", { eager: true });

  return Object.entries(pages).map(([filePath, mod]) => {
    let path = filePath
      .replace("./routes", "")
      .replace(/\.tsx$/, "")
      .replace(/\/index$/, "") || "/";
    return { id: path, path, component: mod.default, loader: mod.loader };
  });
}

// ── URL matching ─────────────────────────────────────────────────────────────

export function matchRoute(
  routes: Route[],
  urlPath: string,
): { route: Route; params: Record<string, string> } | null {
  const cleanPath = urlPath.split("?")[0];
  for (const route of routes) {
    const params = matchSegments(route.path, cleanPath);
    if (params !== null) return { route, params };
  }
  return null;
}

function matchSegments(
  routePath: string,
  urlPath: string,
): Record<string, string> | null {
  const rParts = routePath.split("/").filter(Boolean);
  const uParts = urlPath.split("/").filter(Boolean);
  if (rParts.length !== uParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < rParts.length; i++) {
    if (rParts[i].startsWith("[") && rParts[i].endsWith("]")) {
      params[rParts[i].slice(1, -1)] = decodeURIComponent(uParts[i]);
    } else if (rParts[i] !== uParts[i]) {
      return null;
    }
  }
  return params;
}

// ── Link component (client-side navigation) ──────────────────────────────────

export function Link({
  to,
  children,
  ...props
}: { to: string; children: ReactNode } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
>) {
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      window.history.pushState(null, "", to);
      window.dispatchEvent(new PopStateEvent("popstate"));
    },
    [to],
  );
  return (
    <a href={to} onClick={onClick} {...props}>
      {children}
    </a>
  );
}
