import type { ChartPoint, ChartSeriesMode } from "@/lib/markets/types";

export const NEUTRAL_YES_CHANCE = 0.5;

export const FLAT_SERIES_LABEL =
  "Current market balance — no historical price movement available yet";

export const HISTORY_SERIES_LABEL = "Yes probability over time";

type LedgerRow = {
  amount_cents: number;
  entry_type: string;
  description: string | null;
  created_at: string;
};

export function computeYesChanceFromTotals(
  yesTotal: number,
  noTotal: number,
): number | null {
  const total = yesTotal + noTotal;
  if (total <= 0) {
    return null;
  }

  return yesTotal / total;
}

export function resolveYesChance(
  yesTotal: number | null,
  noTotal: number | null,
): { yesChance: number; source: "positions" | "baseline" } {
  if (yesTotal === null || noTotal === null) {
    return { yesChance: NEUTRAL_YES_CHANCE, source: "baseline" };
  }

  const computed = computeYesChanceFromTotals(yesTotal, noTotal);
  if (computed === null) {
    return { yesChance: NEUTRAL_YES_CHANCE, source: "baseline" };
  }

  return { yesChance: computed, source: "positions" };
}

function detectLedgerSide(
  entryType: string,
  description: string | null,
): "yes" | "no" | null {
  const haystack = `${entryType} ${description ?? ""}`.toLowerCase();

  if (/\b(buy[_-]?yes|yes[_-]?buy|trade[_-]?yes|yes)\b/.test(haystack)) {
    return "yes";
  }

  if (/\b(buy[_-]?no|no[_-]?buy|trade[_-]?no|no)\b/.test(haystack)) {
    return "no";
  }

  return null;
}

export function buildLedgerHistoryPoints(
  ledgerRows: LedgerRow[],
): ChartPoint[] {
  if (ledgerRows.length === 0) {
    return [];
  }

  const sorted = [...ledgerRows].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  let yesTotal = 0;
  let noTotal = 0;
  const points: ChartPoint[] = [];

  for (const row of sorted) {
    const side = detectLedgerSide(row.entry_type, row.description);
    const amount = Math.abs(row.amount_cents);

    if (side === "yes") {
      yesTotal += amount;
    } else if (side === "no") {
      noTotal += amount;
    } else {
      continue;
    }

    const yesChance = computeYesChanceFromTotals(yesTotal, noTotal);
    if (yesChance !== null) {
      points.push({ at: row.created_at, yesChance });
    }
  }

  return points;
}

export function buildChartSeries(input: {
  createdAt: string;
  now?: Date;
  yesChance: number;
  ledgerPoints?: ChartPoint[];
}): {
  points: ChartPoint[];
  mode: ChartSeriesMode;
  label: string;
} {
  const now = input.now ?? new Date();
  const ledgerPoints = input.ledgerPoints ?? [];

  if (ledgerPoints.length >= 2) {
    return {
      points: ledgerPoints,
      mode: "history",
      label: HISTORY_SERIES_LABEL,
    };
  }

  return {
    points: [
      { at: input.createdAt, yesChance: input.yesChance },
      { at: now.toISOString(), yesChance: input.yesChance },
    ],
    mode: "flat",
    label: FLAT_SERIES_LABEL,
  };
}

export function filterChartPointsByRange(
  points: ChartPoint[],
  range: "1d" | "1w" | "1m" | "all",
  now: Date = new Date(),
): ChartPoint[] {
  if (range === "all" || points.length === 0) {
    return points;
  }

  const rangeMs: Record<Exclude<typeof range, "all">, number> = {
    "1d": 24 * 60 * 60 * 1000,
    "1w": 7 * 24 * 60 * 60 * 1000,
    "1m": 30 * 24 * 60 * 60 * 1000,
  };

  const cutoff = now.getTime() - rangeMs[range];
  const filtered = points.filter(
    (point) => new Date(point.at).getTime() >= cutoff,
  );

  if (filtered.length >= 2) {
    return filtered;
  }

  return points;
}
