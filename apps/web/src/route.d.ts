export interface LoaderContext {
  params: Record<string, string>;
  search: URLSearchParams;
  request: Request;
}

export interface Route {
  id: string;
  path: string;
  component: React.ComponentType<any>;
  loader?: (ctx: LoaderContext) => Promise<any>;
  children?: Route[];
}
