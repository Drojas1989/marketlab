import { describe, expect, it } from "vitest";

import {
  formatCloseDate,
  formatStatusLabel,
  formatYesChancePercent,
} from "@/lib/markets/format";

describe("formatStatusLabel", () => {
  it("formats known market statuses", () => {
    expect(formatStatusLabel("open")).toBe("Open");
    expect(formatStatusLabel("closed")).toBe("Closed");
    expect(formatStatusLabel("resolved")).toBe("Resolved");
  });
});

describe("formatCloseDate", () => {
  it("returns a friendly label when close date is missing", () => {
    expect(formatCloseDate(null)).toBe("No close date");
  });

  it("formats a close date", () => {
    expect(formatCloseDate("2026-06-06T18:00:00.000Z")).toContain("2026");
  });
});

describe("formatYesChancePercent", () => {
  it("rounds to a whole percent", () => {
    expect(formatYesChancePercent(0.625)).toBe("63%");
    expect(formatYesChancePercent(0.5)).toBe("50%");
  });
});
