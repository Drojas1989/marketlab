import { describe, expect, it } from "vitest";

import {
  formatFakeBalance,
  formatFakeBalanceCents,
} from "@/lib/profile/format";

describe("formatFakeBalance", () => {
  it("formats workshop starting balance as fake dollars", () => {
    expect(formatFakeBalance(10000)).toBe("$100.00 fake");
  });

  it("formats cents label for tooltips", () => {
    expect(formatFakeBalanceCents(10000)).toBe("10,000 fake cents");
  });
});
