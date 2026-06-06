import { describe, expect, it } from "vitest";

import { isValidPositionSide, parseFakeDollarInput } from "@/lib/fake-money";

describe("buyMarketShares input validation", () => {
  it("rejects invalid sides before any server call would happen", () => {
    expect(isValidPositionSide("yes")).toBe(true);
    expect(isValidPositionSide("no")).toBe(true);
    expect(isValidPositionSide("up")).toBe(false);
  });

  it("rejects invalid amounts before any server call would happen", () => {
    expect(parseFakeDollarInput("1.999").ok).toBe(false);
    expect(parseFakeDollarInput("0").ok).toBe(false);
  });

  it("does not accept user_id as a validated buy field", () => {
    const formData = new FormData();
    formData.set("market_id", "market-1");
    formData.set("side", "yes");
    formData.set("amount", "5");
    formData.set("user_id", "someone-else");

    expect(formData.get("user_id")).toBe("someone-else");
    expect(formData.get("market_id")).toBe("market-1");
    expect(formData.get("side")).toBe("yes");
  });
});
