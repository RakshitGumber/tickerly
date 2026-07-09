import { create } from "zustand";

interface IUseTicker {
  ticker: string | null;
  setTicker: (symbol: string) => void;
}

export const useTicker = create<IUseTicker>()((set) => ({
  ticker: null,
  setTicker: (symbol) => set(() => ({ ticker: symbol.toUpperCase() })),
}));
