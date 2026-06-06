import { describe, expect, it } from "vitest";

import {
  formatFakeDollars,
  formatFakeShares,
  isValidPositionSide,
  parseFakeDollarInput,
} from "@/lib/fake-money";

describe("parseFakeDollarInput", () => {
  it("accepts whole fake dollar amounts", () => {
    expect(parseFakeDollarInput("1")).toEqual({ ok: true, cents: 100 });
    expect(parseFakeDollarInput("10")).toEqual({ ok: true, cents: 1000 });
  });

  it("accepts fake dollar amounts with one or two decimal places", () => {
    expect(parseFakeDollarInput("1.5")).toEqual({ ok: true, cents: 150 });
    expect(parseFakeDollarInput("1.50")).toEqual({ ok: true, cents: 150 });
    expect(parseFakeDollarInput("10.00")).toEqual({ ok: true, cents: 1000 });
  });

  it("rejects empty input", () => {
    expect(parseFakeDollarInput("")).toEqual({
      ok: false,
      error: "Enter a fake dollar amount.",
    });
    expect(parseFakeDollarInput("   ")).toEqual({
      ok: false,
      error: "Enter a fake dollar amount.",
    });
  });

  it("rejects more than two decimal places", () => {
    expect(parseFakeDollarInput("1.999")).toEqual({
      ok: false,
      error: "Use a valid fake dollar amount with up to two decimal places.",
    });
  });

  it("rejects non-numeric input", () => {
    expect(parseFakeDollarInput("abc")).toEqual({
      ok: false,
      error: "Use a valid fake dollar amount with up to two decimal places.",
    });
  });

  it("rejects zero amounts", () => {
    expect(parseFakeDollarInput("0")).toEqual({
      ok: false,
      error: "Amount must be greater than zero.",
    });
    expect(parseFakeDollarInput("0.00")).toEqual({
      ok: false,
      error: "Amount must be greater than zero.",
    });
  });
});

describe("formatFakeDollars", () => {
  it("formats cents as fake dollars", () => {
    expect(formatFakeDollars(10000)).toBe("$100.00 fake");
    expect(formatFakeDollars(150)).toBe("$1.50 fake");
  });
});

describe("formatFakeShares", () => {
  it("formats share cents like fake dollars", () => {
    expect(formatFakeShares(250)).toBe("$2.50 fake");
  });
});

describe("isValidPositionSide", () => {
  it("accepts yes and no", () => {
    expect(isValidPositionSide("yes")).toBe(true);
    expect(isValidPositionSide("no")).toBe(true);
  });

  it("rejects invalid sides", () => {
    expect(isValidPositionSide("maybe")).toBe(false);
    expect(isValidPositionSide("")).toBe(false);
  });
});
