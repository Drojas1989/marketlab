export type MarketStatus = "open" | "closed" | "resolved";

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
