import { describe, expect, it } from "vitest";

import {
  buildChartSeries,
  buildLedgerHistoryPoints,
  computeYesChanceFromTotals,
  filterChartPointsByRange,
  NEUTRAL_YES_CHANCE,
  resolveYesChance,
} from "@/lib/markets/probability";

describe("computeYesChanceFromTotals", () => {
  it("computes yes chance from aggregate totals", () => {
    expect(computeYesChanceFromTotals(700, 300)).toBe(0.7);
  });

  it("returns null when there is no activity", () => {
    expect(computeYesChanceFromTotals(0, 0)).toBeNull();
  });
});

describe("resolveYesChance", () => {
  it("uses aggregate positions when totals are available", () => {
    expect(resolveYesChance(600, 400)).toEqual({
      yesChance: 0.6,
      source: "positions",
    });
  });

  it("falls back to a neutral baseline when totals are unavailable", () => {
    expect(resolveYesChance(null, null)).toEqual({
      yesChance: NEUTRAL_YES_CHANCE,
      source: "baseline",
    });
  });

  it("falls back to a neutral baseline when totals are empty", () => {
    expect(resolveYesChance(0, 0)).toEqual({
      yesChance: NEUTRAL_YES_CHANCE,
      source: "baseline",
    });
  });
});

describe("buildLedgerHistoryPoints", () => {
  it("reconstructs yes/no activity over time from ledger rows", () => {
    const points = buildLedgerHistoryPoints([
      {
        amount_cents: 100,
        entry_type: "buy_yes",
        description: null,
        created_at: "2026-06-01T10:00:00.000Z",
      },
      {
        amount_cents: 100,
        entry_type: "buy_no",
        description: null,
        created_at: "2026-06-01T11:00:00.000Z",
      },
    ]);

    expect(points).toHaveLength(2);
    expect(points[0].yesChance).toBe(1);
    expect(points[1].yesChance).toBe(0.5);
  });
});

describe("buildChartSeries", () => {
  const now = new Date("2026-06-06T12:00:00.000Z");

  it("renders a flat current-state line when ledger history is unavailable", () => {
    const series = buildChartSeries({
      createdAt: "2026-06-01T00:00:00.000Z",
      now,
      yesChance: 0.5,
    });

    expect(series.mode).toBe("flat");
    expect(series.points).toHaveLength(2);
    expect(series.points[0].yesChance).toBe(0.5);
    expect(series.points[1].yesChance).toBe(0.5);
    expect(series.label).toContain("Current market balance");
  });

  it("uses ledger history when enough points are available", () => {
    const ledgerPoints = [
      { at: "2026-06-01T10:00:00.000Z", yesChance: 0.6 },
      { at: "2026-06-02T10:00:00.000Z", yesChance: 0.7 },
    ];

    const series = buildChartSeries({
      createdAt: "2026-06-01T00:00:00.000Z",
      now,
      yesChance: 0.7,
      ledgerPoints,
    });

    expect(series.mode).toBe("history");
    expect(series.points).toEqual(ledgerPoints);
  });
});

describe("filterChartPointsByRange", () => {
  const points = [
    { at: "2026-05-01T00:00:00.000Z", yesChance: 0.4 },
    { at: "2026-06-05T00:00:00.000Z", yesChance: 0.5 },
    { at: "2026-06-06T00:00:00.000Z", yesChance: 0.6 },
  ];

  it("returns all points for the all range", () => {
    expect(filterChartPointsByRange(points, "all")).toEqual(points);
  });

  it("keeps the original series when filtering would leave too few points", () => {
    const now = new Date("2026-06-06T12:00:00.000Z");
    expect(filterChartPointsByRange(points, "1d", now)).toEqual(points);
  });
});
