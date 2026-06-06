export type MarketStatus = "open" | "closed" | "resolved";

export type PositionSide = "yes" | "no";

export type PositionSnapshot = {
  yes_shares_cents: number;
  no_shares_cents: number;
};

export type BuyActionState = {
  error?: string;
  success?: string;
};

export type Market = {
  id: string;
  title: string;
  description: string | null;
  status: MarketStatus;
  close_date: string | null;
  created_at: string;
  updated_at: string;
};

export type ChartPoint = {
  at: string;
  yesChance: number;
};

export type ChartSeriesMode = "history" | "flat";

export type MarketProbabilityData = {
  yesChance: number;
  noChance: number;
  source: "positions" | "baseline";
  seriesMode: ChartSeriesMode;
  seriesLabel: string;
  points: ChartPoint[];
};
